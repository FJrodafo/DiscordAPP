const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('web-screenshot')
        .setDescription('Take a screenshot of the entire website.')
        .setDefaultMemberPermissions(0)
        .addStringOption(option => option
            .setName('url')
            .setDescription('Link to website')
            .setRequired(true),
        ),
    async execute(interaction) {
        const URL = interaction.options.getString('url');
        await interaction.deferReply();
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.screenshot({
            path: 'web-screenshot.png',
            type: 'png',
            fullPage: true,
        });
        const imagePath = './web-screenshot.png';
        const imageFile = new AttachmentBuilder(imagePath);
        await interaction.editReply({ files: [imageFile] });
        await browser.close();
    },
};
