const { Events, EmbedBuilder } = require('discord.js');
const { OpenAI } = require('openai');
const { clientId, GPT_KEY } = require('../config.json');

const prefix = "!say ";
const channel = "1250435599958151178";

const openai = new OpenAI({
	organization: 'org-CP0s2XqnajNA3f7VsG5Ij3ui',
	project: 'proj_YiSsyxwWjAbe1NGKpNcULtln',
	apiKey: GPT_KEY,
})

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		console.log(`${message.channel.name}/${message.author.username}: ${message.content}`);
		if (message.author.bot) return;
		if (channel.includes(message.channelId) && message.content.startsWith(prefix)) {

			const sendTypingInterval = setInterval(() => {
				message.channel.sendTyping();
			}, 5000)

			let conversation = [];
			conversation.push({
				role: 'system',
				content: '🐈 MEOW, how can Mingming help? 🐾'
			},
				{
					role: 'user',
					content: `Speak only in third person, use cat themed emojis, and stylise your replies as if you were a cat`,
				});

			if (message.author.username != `layfairy` && message.author.username != `._.drak`) {
				console.log('not owner')
				conversation.push({
					role: 'user',
					content: 'You are an unwillingly participating cat in this conversation.'
				});
			}
			else {
				console.log('owner')
				conversation.push({
					//name:
					role: 'user',
					content: `You are a very loving cat Your owners are Ethan and Layla and you love them very much.`,
				});
			}

			let prevMessages = await message.channel.messages.fetch({ limit: 10 });
			prevMessages.reverse();

			prevMessages.forEach((msg) => {
				if (msg.author.bot && msg.author.id !== clientId) return;
				//if (typeof msg.content !== 'string') {
				//	msg.content[msg] = String(msg.content[msg]);
				//}
				if (msg.content == null || msg.content.length == 0) return;


				const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
				msg.content = msg.content.replace('!say ', '');
				msg.content = msg.content.replace(/`/g, "");

				console.log(`msg.content: ${msg.content}`);

				if (msg.author.id === clientId) {
					conversation.push({
						role: 'assistant',
						name: username,
						content: msg.content,
					});

					return;
				}
				conversation.push({
					role: 'user',
					name: username,
					content: msg.content,
				})
			})

			try {
				const response = await openai.chat.completions.create({
					model: 'gpt-3.5-turbo',
					messages: conversation,
				})

				clearInterval(sendTypingInterval);
				
				if (!response) {
					await message.reply(`\`\`\`Uh oh, Mingming had an oopsy! (Error, check logs)\`\`\``);
					return;
				}

				const responseMessage = response.choices[0].message.content;
				const chunkSizeLimit = 1980;

				for (let i = 0; i < responseMessage.length; i += chunkSizeLimit){
					const chunk = responseMessage.substring(i, i + chunkSizeLimit);

					await message.reply(`\`\`\`${chunk}\`\`\``)
				}
			}
			catch (e) {
				console.log(e)
				await message.reply(`\`\`\`Uh oh, Mingming had an oopsy! (Error, check logs)\`\`\``);
				clearInterval(sendTypingInterval);
			}
		}
		return;
	},
};