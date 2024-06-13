const { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('translate')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\n------------END------------`);

        try{
            const text = interaction.targetMessage;
    
            await interaction.deferReply();
    
            const applied = await translate(text, { to: 'en' });
    
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Translate Successful")
                .addFields(
                    { name: 'Old Text', value: `\`\`\`${text}\`\`\``, incline: false},
                    {name: 'Translated Text', value: `\`\`\`${applied.text}\`\`\``, incline: false}
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