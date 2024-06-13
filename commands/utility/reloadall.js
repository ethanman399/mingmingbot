const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reloadall')
		.setDescription('Reloads all commands.'),
	async execute(interaction, data) {
		await interaction.deferReply();

        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

		if (userid !== "131524264288452608") {
			return interaction.editReply({
				embeds: [new EmbedBuilder()
					.setColor("Red")
					.setDescription(`This command is only for the developer!`)], ephemeral: true
			})
		}
		else {
			await interaction.editReply('Reloading Commands...');
			console.log(`User ${username} approved.`)
			// Grab all the commands folder
			const foldersPath = path.join('commands');
			const commandFolders = fs.readdirSync(foldersPath);

			for (const folder of commandFolders) {
				console.log(`Folder to Reload: ${folder}`);
				// Grab all the command files from the commands directory you created earlier
				const commandsPath = path.join(foldersPath, folder);
				const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
				// Reload loop
				for (const file of commandFiles) {
					const filePath = path.join(`${__dirname}/../../`, commandsPath, file);
					const command = require(filePath);
					if ('data' in command && 'execute' in command) {
						delete require.cache[require.resolve(`${filePath}`)];

						try {
							const newCommand = require(`${filePath}`);
							interaction.client.commands.set(newCommand.data.name, newCommand);
							console.log(`Reloaded: ${newCommand.data.name}`);
							await interaction.followUp({
								embeds: [new EmbedBuilder()
									.setColor("Green")
									.setDescription(`Command ${command.data.name} reloaded!`)], ephemeral: true
							})
						} catch (error) {
							console.error(error);
							console.log(`There was an error while reloading command \`${command.data.name}\`:\n\`${error.message}\``);
							await interaction.followUp({
								embeds: [new EmbedBuilder()
									.setColor("Red")
									.setDescription(`Command ${command.data.name} failed to reload!`)], ephemeral: true
							})
						}
					}
					else {
						console.log(`Command \`${command.data.name}\` does not contain command.`);
					}
				}
			}
		}
	},
};