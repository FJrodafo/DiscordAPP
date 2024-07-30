const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dauntless-gauntlet-leaderboard')
        .setDescription('Provides information on the top 5 in Gauntlet.'),
    async execute(interaction) {
        await interaction.deferReply();
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://playdauntless.com/gauntlet/leaderboard/', { waitUntil: 'networkidle2' });
        await page.screenshot({
            path: 'dauntless-gauntlet-leaderboard.png',
            type: 'png',
            clip: { x: 761, y: 440, width: 600, height: 421 },
        });
        const imagePath = './dauntless-gauntlet-leaderboard.png';
        const imageFile = new AttachmentBuilder(imagePath);
        await interaction.editReply({ files: [imageFile] });
        await browser.close();
    },
};

// DATA EXTRACTION
/*
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dauntless-gauntlet-leaderboard')
        .setDescription('Provides information on the top 5 in Gauntlet.'),
    async execute(interaction) {
        await interaction.deferReply();
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://playdauntless.com/gauntlet/leaderboard/', { waitUntil: 'networkidle2' });
        const topGuilds = await page.$eval('.leaderboard__entries', el => {
            const entries = el.querySelectorAll('.leaderboard__entry');
            const guilds = [];
            entries.forEach((entry) => {
                const rank = entry.querySelector('.rank').innerText;
                const guildName = entry.querySelector('.guild-name').innerText;
                const guildTag = entry.querySelector('.guild-tag').innerText;
                const level = entry.querySelector('.level span').innerText;
                const timeLeft = entry.querySelector('.time-left span').innerText;
                guilds.push({
                    rank,
                    guildName,
                    guildTag,
                    level,
                    timeLeft,
                });
            });
            return guilds.slice(0, 5);
        });
        const topGuildsInfo = topGuilds.map((guild, index) => (`\n${getRankEmoji(index + 1)} **${guild.guildName}** [${guild.guildTag}]\nLevel: **${guild.level}** Time Left: **${guild.timeLeft}**`)).join('\n');
        const iconPath = './../../assets/dauntless/Gauntlet.png';
        const iconFile = new AttachmentBuilder(iconPath);
        const embed = new EmbedBuilder()
            .setColor(0xC09146)
            .setAuthor({ name: 'Gauntlet Leaderboard', iconURL: 'attachment://Gauntlet.png', url: 'https://playdauntless.com/gauntlet/leaderboard/' })
            .setDescription(topGuildsInfo);
        await interaction.editReply({ embeds: [embed], files: [iconFile] });
        await browser.close();
    },
};

function getRankEmoji(rank) {
    switch (rank) {
    case 1:
        return '🥇';
    case 2:
        return '🥈';
    case 3:
        return '🥉';
    default:
        return `**${rank}.**`;
    }
}
*/

// JSON
/*
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dauntless-gauntlet-leaderboard')
        .setDescription('Provides information on the top 5 in Gauntlet.'),
    async execute(interaction) {
        https.get('https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-season10.json', (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const leaderboardData = JSON.parse(data);
                const topGuilds = leaderboardData.leaderboard.slice(0, 5);
                const topGuildsInfo = topGuilds.map((guild, index) => (`\n${getRankEmoji(index + 1)} **${guild.guild_name}** [${guild.guild_nameplate}]\nLevel: **${guild.level}** Time Left: **${formatTime(guild.remaining_sec)}**`)).join('\n');
                const iconPath = './../../assets/dauntless/Gauntlet.png';
                const iconFile = new AttachmentBuilder(iconPath);
                const embed = new EmbedBuilder()
                    .setColor(0xC09146)
                    .setAuthor({ name: 'Gauntlet Leaderboard', iconURL: 'attachment://Gauntlet.png', url: 'https://playdauntless.com/gauntlet/leaderboard/' })
                    .setDescription(topGuildsInfo);
                interaction.reply({ embeds: [embed], files: [iconFile] });
            });
        }).on('error', (error) => {
            console.error('Error obtaining information:', error);
            interaction.reply({ content: 'Error obtaining information. Please try again later.', ephemeral: true });
        });
    },
};

function getRankEmoji(rank) {
    switch (rank) {
    case 1:
        return '🥇';
    case 2:
        return '🥈';
    case 3:
        return '🥉';
    default:
        return `**${rank}.**`;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
*/
