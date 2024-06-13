const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName ('add')
        .setDescription ('This command will add two numbers.')
        .addNumberOption(option =>
            option
            .setName('first_num')
            .setDescription('Enter first number:')
            .setRequired(true)
        )
        .addNumberOption(option =>
            option
            .setName('second_num')
            .setDescription('Enter second number:')
            .setRequired(true)
        ),
    
    async execute(interaction) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

        const firstNumber = interaction.options.getNumber('first_num');
        const secondNumber = interaction.options.getNumber('second_num');

        if(isNaN(firstNumber) || isNaN(secondNumber)){
            await interaction.reply('Please enter a valid number.');
        }
        else{
            const result = firstNumber + secondNumber;
            await interaction.reply(`The sum of ${firstNumber} + ${secondNumber} = ${result}.`)
        }
    }
}