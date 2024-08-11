const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('fml')
        .setDescription('Your everyday life stories!'),
    async execute(interaction) {
        await interaction.deferReply();
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://www.fmylife.com/random', { waitUntil: 'networkidle2' });
        const articleData = await page.$eval('article', el => {
            const anchors = el.querySelectorAll('a');
            const lastAnchor = anchors[anchors.length - 1];
            return {
                author: el.querySelector('p').innerText,
                text: lastAnchor.innerText,
                url: 'https://www.fmylife.com' + lastAnchor.getAttribute('href'),
            };
        });
        const embed = new EmbedBuilder()
            .setColor(0xFC8CB4)
            .setTitle(articleData.author)
            .setURL(articleData.url)
            .setDescription(articleData.text)
            .setThumbnail('https://www.fmylife.com/images/header/logo-fml.png')
            .setImage('https://www.fmylife.com/images/header/baseline-fml.png');
        await interaction.editReply({ embeds: [embed] });
        await browser.close();
    },
};
