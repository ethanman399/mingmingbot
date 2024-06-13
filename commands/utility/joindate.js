const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 2,
	data: new SlashCommandBuilder()
		.setName('joindate')
		.setDescription('Provides join date of the user to this server.'),
	async execute(interaction) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

		await interaction.reply(`Hello ${interaction.user}, you joined this server on **${interaction.member.joinedAt}**.`);
	},
};