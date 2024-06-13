const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reloadutil')
		.setDescription('Reloads a command in utility subfolder.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction, data) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);
		for (var com of interaction.client.commands){
			console.log(com);
		}

		if (userid !== "131524264288452608") {
			return interaction.Reply({
				embeds: [new EmbedBuilder()
					.setColor("Red")
					.setDescription(`This command is only for the developer!`)], ephemeral: true
			})
		}
		else {
			const commandName = interaction.options.getString('command', true).toLowerCase();
			const command = interaction.client.commands.get(commandName);

			if (!command) {
				return interaction.reply(`There is no command with name \`${commandName}\`!`);
			}

			delete require.cache[require.resolve(`./${command.data.name}.js`)];

			try {
				const newCommand = require(`./${command.data.name}.js`);
				interaction.client.commands.set(newCommand.data.name, newCommand);
				await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
			} catch (error) {
				console.error(error);
				await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
			}
		}
	},
};