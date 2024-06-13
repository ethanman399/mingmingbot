const { SlashCommandBuilder } = require('discord.js');

const awaitTimeout = delay =>
    new Promise(resolve => setTimeout(resolve, delay));

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

module.exports = {
	cooldown: 2,
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Pet the cat!'),
	async execute(interaction) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

		await interaction.deferReply();

        await awaitTimeout(getRandomInt(2,4)*1000)

        const user = interaction.user.username;

        if (user === "layfairy") {
            await interaction.editReply("hehehe *PURRRR PURRR* MEOW MEOW **MEOW** THANK U I LOVE YOU")
        } 
        else {
            await interaction.editReply("YOU'RE NOT MY OWNER EWWWWWW GO AWAY ***farts and runs away***")
        }
	}
};