console.log(`Bot-Vk`);
const { VK } = require(`vk-io`);
const https = require(`https`);
const vk = new VK();
const request = require(`request`)
const commands = [];
const utils = {
	sp: (int) => {
		int = int.toString();
		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
	},
	rn: (int, fixed) => {
		if (int === null) return null;
		if (int === 0) return '0';
		fixed = (!fixed || fixed < 0) ? 0 : fixed;
		let b = (int).toPrecision(2).split('e'),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
			d = c < 0 ? c : Math.abs(c),
			e = d + ['', 'тыс', 'млн', 'млрд', 'трлн'][k];

			e = e.replace(/e/g, '');
			e = e.replace(/\+/g, '');
			e = e.replace(/Infinity/g, 'ДОХЕРА');

		return e;
	},
	gi: (int) => {
		int = int.toString();

		let text = ``;
		for (let i = 0; i < int.length; i++)
		{
			text += `${int[i]}&#8419;`;
		}
		return text;
	},
	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
	pick: (array) => {
		return array[utils.random(array.length - 1)];
	}
}
async function saveUsers()
{
	require('fs').writeFileSync('./users.json', JSON.stringify(users, null, '\t'));
	return true;
}
setInterval(async () => {
	await saveUsers();
}, 100);
let users = require('./users.json');

vk.setOptions({ token: '6c7ff9992a971135f73b31e49ecfd65a87a6b561453ee6be87374761720c8798f3ac9fe77e458907f81b1', pollingGroupId: 173290101});
const { updates, snippets } = vk;
updates.startPolling();
updates.on('message', async (message) => { 
	if(Number(message.senderId) <= 0) return;
	if(/\[public190950548\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[public190950548\|(.*)\]/ig, '').trim();
	if(!users.find(x=> x.id === message.senderId))
	{
		const [user_info] = await vk.api.users.get({ user_id: message.senderId });
		const date = new Date();

		users.push({
			realname: user_info.first_name,
			realfam: user_info.last_name,
			id: message.senderId,
			uid: users.length,
			regDate: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			tag: ``,
			message: 0
		});
	}
	message.user = users.find(x=> x.id === message.senderId);
	if (message.text) {
	message.user.message += 1;
		}
	const bot = (text, params) => {
		return message.send(`@id${message.user.id} (${message.user.realname})`,`${text}`, params);
	}
	const command = commands.find(x=> x[0].test(message.text));
	if(!command) return;

	message.args = message.text.match(command[0]);
	await command[1](message, bot);
	console.log(`${message.user.realname}: ${message.text}`)
});

const cmd = {
	on: (p, f) => {
		commands.push([p, f])
	}
}
cmd.on(/^(?:Начать)$/i, async (message, bot) => {
	message.send(`*id${message.user.id} (${message.user.realname}), привет!`)
});
cmd.on(/^(?:Чат меню)$/i, async (message, bot) => { 
message.send(`ид чата: ${message.chatId}
	Бутылочка`)
});
cmd.on(/^(?:Бутылочка)$/i, async (message, bot) => { 
if(!message.isChat) return bot(`Команда работает только в беседе`)
let { profiles } = await vk.api.messages.getConversationMembers({
	peer_id: message.peerId
});
let profile = utils.pick(profiles); 
let profile2 = utils.pick(profiles);  
message.send(`Бутылочка
	[id${profile.id}|${profile.first_name}] и [id${profile2.id}|${profile2.first_name}] - ваше действие: ` + utils.pick(['Поцеловаться','Пропускаете ход']));
});
function getRandomElement (array) {
	return array[getRandomInt(array.length - 1)];
}
function getRandomInt(X, y) {
	return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.round() * x);
}

cmd.on(/^(?:Бот помощь)$/i, async (message, bot) => {
	message.send(`⚙Команды боты⚙

🔍Бот помощь

📅[Команды расписания]📅

📝Бот понедельник
📝Бот вторник
📝Бот среда
📝Бот четверг
📝Бот пятница
📝Бот Суббота
📝Бот расписание (Общее расписание)

📘Замена число.месяц.год
Пример: Замена 23.01.2020

📖Методичка Фамилия
Пример: Методичка Вавилина`)
});

cmd.on(/^(?:Бот понеделник)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на понедельник📅

1⃣ Компьютерные сети Тазетдинова А.Г
2⃣ Безопасность жизнедеятельности Агарков И.Г
3⃣ Компьютерные сети Тазетдинова А.Г`)
});

cmd.on(/^(?:Бот вторник)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на вторник📅

1⃣ МДК 02.01 (1С) Вавилина В.Г
2⃣ Физическая культура Тарасов В.Л
3⃣ МДК 02.02 (Project) Вавилина В.Г`)
});

cmd.on(/^(?:Бот среда)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на среду📅 

1⃣ МДК 01.02 (SQL+C#) Анурьева Ю.Л 
2⃣ МДК 02.01 (1С) Вавилина В.Г 
3⃣ МДК 02.02 (Project) Вавилина В.Г`)
});

cmd.on(/^(?:Бот четверг)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на четверг📅 

1⃣ МДК 02.02 (Project) Вавилина В.Г 
2⃣ МДК 02.01 (1С) Вавилина В.Г 
3⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л`)
});

cmd.on(/^(?:Бот пятница)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на пятницу📅 

1⃣ МДК 02.02 (Project) Вавилина В.Г 
2⃣ Иностранный язык Гордеев В.О/ Киселева .Ю.Ю 
3⃣ МДК 01.02 (SQL+C#) Анурьева Ю.Л`)
});

cmd.on(/^(?:Бот суббота)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на субботу📅 

1⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л 
2⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л 
3⃣ Компьютерные сети Тазетдинова А.Г`)
});

cmd.on(/^(?:Бот расписание)$/i, async (message, bot) => {
	message.send(`📅Стандартное расписание на понедельник📅

1⃣ Компьютерные сети Тазетдинова А.Г
2⃣ Безопасность жизнедеятельности Агарков И.Г
3⃣ Компьютерные сети Тазетдинова А.Г 
 
📅Стандартное расписание на вторник📅

1⃣ МДК 02.01 (1С) Вавилина В.Г
2⃣ Физическая культура Тарасов В.Л
3⃣ МДК 02.02 (Project) Вавилина В.Г 
 
📅Стандартное расписание на среду📅 

1⃣ МДК 01.02 (SQL+C#) Анурьева Ю.Л 
2⃣ МДК 02.01 (1С) Вавилина В.Г 
3⃣ МДК 02.02 (Project) Вавилина В.Г 
 
📅Стандартное расписание на четверг📅 

1⃣ МДК 02.02 (Project) Вавилина В.Г 
2⃣ МДК 02.01 (1С) Вавилина В.Г 
3⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л 
 
📅Стандартное расписание на пятницу📅 

1⃣ МДК 02.02 (Project) Вавилина В.Г 
2⃣ Иностранный язык Гордеев В.О/ Киселева .Ю.Ю 
3⃣ МДК 01.02 (SQL+C#) Анурьева Ю.Л
 
📅Стандартное расписание на субботу📅 

1⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л 
2⃣ МДК 01.01 (SQL+C#) Анурьева Ю.Л 
3⃣ Компьютерные сети Тазетдинова А.Г`)
});

cmd.on(/^(?:Методичка Вавилина)$/i, async (message, bot) => {
	message.send(`💻Методический материал по 1С: Предприятие 💻
	
1⃣https://vk.com/doc155207640_533761893

2⃣https://vk.com/doc155207640_533765674

3⃣https://vk.com/doc155207640_533765697

4⃣https://vk.com/doc155207640_533765717

6⃣https://vk.com/doc155207640_533765840

7⃣https://vk.com/doc155207640_533765863

8⃣https://vk.com/doc155207640_533765875

9⃣https://vk.com/doc155207640_533765901

1⃣0⃣https://vk.com/doc155207640_533765917

1⃣1⃣https://vk.com/doc155207640_533765934

1⃣2⃣https://vk.com/doc155207640_533765951

1⃣3⃣https://vk.com/doc155207640_533765970

1⃣4⃣https://vk.com/doc155207640_533765993

1⃣5⃣https://vk.com/doc155207640_533766012`)
});

cmd.on(/^(?:Замены 23.01.2020)$/i, async (message, bot) => {
	message.send(`на 1,2 пару идет вторая подгруппа на ВГ а первая группа спит
	на 3-4 пару идет 1 группа на ВГ а 2 группа к Ануру`)
});
