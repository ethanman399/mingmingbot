const { SlashCommandBuilder, MessageContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tran')
        .setDescription('Translate message.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to translate.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate to.')
                .addChoices(
                    {name: 'English', value: 'en'},
                    {name: 'Swedish', value: 'sv'},
                    {name: 'Dutch', value: 'nl'},
                    {name: 'Spanish', value: 'es'},
                    {name: 'Japanese', value: 'ja'},
                    {name: 'Chinese (Simplified)', value: 'zh-cn'},
                )
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

        try{
            const { options } = interaction;
            const text = options.getString('message');
            const lan = options.getString('language')
    
            await interaction.reply('Translating the messsage for you...');
    
            const applied = await translate(text, { to: `${lan}` });
    
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Translate Successful")
                .addFields(
                    { name: 'Old Text', value: `\`\`\`${text}\`\`\``, inline: false },
                    { name: 'Translated Text', value: `\`\`\`${applied.text}\`\`\``, inline: false },
                    { name: 'Language', value: `\`\`\`${lan}\`\`\``, inline: false }
                )
    
                await interaction.editReply({embeds: [embed]})
        }
        catch (e){
            console.error(e);
            const exitEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Translate Unuccessful")
                .setDescription(`\`\`\`Error! Check logs.\`\`\``)
            await interaction.editReply({embeds: [exitEmbed]})
        }
    }
}