const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow } = require('discord.js');
const puppeteer = require('puppeteer');

const awaitTimeout = delay =>
    new Promise(resolve => setTimeout(resolve, delay));

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('Ask Mingming a single instance question (no continued conversations).')
        .addStringOption(option =>
            option.setName('prompt').setDescription('The prompt for Mingming to respond to.').setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply('');

        const { options } = interaction;
        const prompt = options.getString('prompt');
        const username = interaction.user.username;
		const userid = interaction.user.id;
		const interactionname = `${this.data.name}`;
		console.log(`-----------START-----------\nUser: ${username}\nUser ID: ${userid}\nInteraction name: ${interactionname}\nPrompt: ${prompt}\n------------END------------`);
        const startEmbed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setDescription(`\`\`\`Prompt: ${prompt}\`\`\``);
        
        await interaction.editReply({
            embeds: [startEmbed],
        })

        const browser = await puppeteer.launch({ 
            headless: false
        });
        const page = await browser.newPage();

        await page.goto('https://mingming.zapier.app/');

        //prompt
        await page.waitForSelector('textarea[placeholder="automate"]');
        await page.locator('textarea[placeholder="automate"]').click();
        await awaitTimeout(1000);
        await page.keyboard.type(prompt);
        await page.keyboard.press("Enter");

        //response
        await awaitTimeout(6000);
        await page.waitForSelector('[data-testid="bot-message"] p');

        var value = await page.$$eval('[data-testid="bot-message"]', async (elements) => {
            return elements.map((element) => element.textContent);
        });

        setTimeout(async () => {
            if (value.length == 0) return await interaction.followUp({ content: `There was an error getting the response.`});
        }, 30000);

        value.shift();
        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setDescription(`\`\`\`${value.join('\n\n\n\n')}\`\`\``);

        const button = new ButtonBuilder()
            .setCustomId('exit')
            .setLabel('Exit')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(button);

        const response = await interaction.followUp({
             embeds: [embed],
             components: [row],
            });

        const collectorFilter = i => i.user.id === userid;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});

            if(confirmation.customId === 'exit'){
                await browser.close();
                await response.delete() .then(msg => console.log(`Deleted message from ${msg.author.username}`)) .catch(console.error);
                const exitEmbed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setDescription(`\`\`\`Goodbye! :)\`\`\``);
                return await interaction.followUp({
                    embeds: [exitEmbed],
                });
            }
        }
        catch(e){
            console.log(e);
            await browser.close();
            const exitEmbed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setDescription(`\`\`\`Timed out after 1 minute, goodbye! :)\`\`\``);
            return await interaction.followUp({ 
                embeds: [exitEmbed],
            });
        }
    },
};