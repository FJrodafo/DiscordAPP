const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
/* const puppeteer = require('puppeteer'); */
/* const https = require('https'); */
const fs = require('fs');
process.chdir(__dirname);

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dauntless')
        .setDescription('A collection of dauntless commands!')
        .addSubcommand(subcommand => subcommand
            .setName('gauntlet-leaderboard')
            .setDescription('Provides information on the top 5 in Gauntlet!')
            .addIntegerOption(option => option
                .setName('season')
                .setDescription('Number of messages to prune')
                .setRequired(true),
            ),
        )
        .addSubcommand(subcommand => subcommand
            .setName('meta-builds')
            .setDescription('Find your meta build!')
            .addStringOption(option => option
                .setName('weapon')
                .setDescription('Select a weapon')
                .setRequired(true)
                .addChoices(
                    { name: 'Aether Strikers', value: 'aether_strikers' },
                    { name: 'Axe', value: 'axe' },
                    { name: 'Chain Blades', value: 'chain_blades' },
                    { name: 'Hammer', value: 'hammer' },
                    { name: 'Repeaters', value: 'repeaters' },
                    { name: 'Sword', value: 'sword' },
                    { name: 'War Pike', value: 'war_pike' },
                ),
            )
            .addStringOption(option => option
                .setName('element')
                .setDescription('Select an element')
                .setRequired(true)
                .addChoices(
                    { name: 'Shock', value: 'shock' },
                    { name: 'Blaze', value: 'blaze' },
                    { name: 'Umbral', value: 'umbral' },
                    { name: 'Terra', value: 'terra' },
                    { name: 'Frost', value: 'frost' },
                    { name: 'Radiant', value: 'radiant' },
                ),
            ),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'gauntlet-leaderboard') {
            // SCREENSHOT
            /*
            await interaction.deferReply();
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.goto('https://playdauntless.com/gauntlet/leaderboard/', { waitUntil: 'networkidle2' });
            await page.screenshot({
                path: './../../assets/command-output/gauntlet-leaderboard.png',
                type: 'png',
                clip: { x: 761, y: 440, width: 600, height: 421 },
            });
            const imagePath = './../../assets/command-output/gauntlet-leaderboard.png';
            const imageFile = new AttachmentBuilder(imagePath);
            await interaction.editReply({ files: [imageFile] });
            await browser.close();
            */

            // DATA EXTRACTION
            /*
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
                .setAuthor({ name: 'Gauntlet Leaderboard', iconURL: 'attachment://Gauntlet.png', url: 'https://playdauntless.com/gauntlet/leaderboard/' })
                .setDescription(topGuildsInfo);
            await interaction.editReply({ embeds: [embed], files: [iconFile] });
            await browser.close();
            */

            // JSON
            const season = interaction.options.getInteger('season');
            if (season < 1 || season > 14) return interaction.reply({ content: 'You need to input a number between `1` and `14`', ephemeral: true });
            const jsonPath = `./../../database/dauntless/gauntlet/season${season}.json`;
            const leaderboardData = require(jsonPath);
            const topGuilds = leaderboardData.leaderboard.slice(0, 5);
            const topGuildsInfo = topGuilds.map((guild, index) => (`\n${getRankEmoji(index + 1)} **${guild.guild_name}** [${guild.guild_nameplate}]\nLevel: **${guild.level}** Time Left: **${formatTime(guild.remaining_sec)}**`)).join('\n');
            const iconPath = './../../assets/dauntless/Gauntlet.png';
            const iconFile = new AttachmentBuilder(iconPath);
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Gauntlet Leaderboard', iconURL: 'attachment://Gauntlet.png', url: 'https://playdauntless.com/gauntlet/leaderboard/' })
                .setDescription(topGuildsInfo);
            return interaction.reply({ embeds: [embed], files: [iconFile], ephemeral: true });

            // API
            /*
            https.get('https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-season08.json', (response) => {
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
                        .setAuthor({ name: 'Gauntlet Leaderboard', iconURL: 'attachment://Gauntlet.png', url: 'https://playdauntless.com/gauntlet/leaderboard/' })
                        .setDescription(topGuildsInfo);
                    interaction.reply({ embeds: [embed], files: [iconFile] });
                });
            }).on('error', (error) => {
                console.error('Error obtaining information:', error);
                interaction.reply({ content: 'Error obtaining information. Please try again later.', ephemeral: true });
            });
            */
        }
        else if (subcommand === 'meta-builds') {
            const weapon = interaction.options.getString('weapon');
            const element = interaction.options.getString('element');
            const jsonPath = './../../database/dauntless/meta-builds.json';
            const data = require(jsonPath);
            const buildInfo = data[weapon][element];
            const thumbnailPath = `./../../assets/dauntless/builds/${buildInfo.omnicell}`;
            const imagePath = './../../assets/command-output/meta-builds.png';
            const combinedImage = await combineImages(buildInfo.weapon, buildInfo.armor, buildInfo.supplies);
            fs.writeFileSync(imagePath, combinedImage.toBuffer());
            const thumbnailFile = new AttachmentBuilder(thumbnailPath);
            const imageFile = new AttachmentBuilder(imagePath);
            let embed;
            if (buildInfo.best) {
                embed = new EmbedBuilder()
                    .setTitle(`${buildInfo.name} Meta Build:`)
                    .setDescription(buildInfo.perks.join('\n'))
                    .setThumbnail(`attachment://${buildInfo.omnicell}`)
                    .setImage('attachment://meta-builds.png')
                    .setFooter({ text: `${buildInfo.best}` });
            }
            else {
                embed = new EmbedBuilder()
                    .setTitle(`${buildInfo.name} Meta Build:`)
                    .setDescription(buildInfo.perks.join('\n'))
                    .setThumbnail(`attachment://${buildInfo.omnicell}`)
                    .setImage('attachment://meta-builds.png');
            }
            await interaction.reply({ embeds: [embed], files: [thumbnailFile, imageFile], ephemeral: true });
        }
    },
};

function getRankEmoji(rank) {
    switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `**${rank}.**`;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function combineImages(weapon, armor, supplies) {
    const canvas = createCanvas(320, 180);
    const ctx = canvas.getContext('2d');
    const weaponRowStartX = (canvas.width - weapon.length * 64) / 2;
    const suppliesRowStartX = (canvas.width - supplies.length * 32) / 2;
    if (weapon.length !== 5) await drawIcons(ctx, weapon, 0, weaponRowStartX, 1);
    else await drawIcons(ctx, weapon, 0, 0, 1);
    await drawIcons(ctx, armor, 74, 0, 1);
    await drawIcons(ctx, supplies, 148, suppliesRowStartX, 0.5);
    return canvas;
}

async function drawIcons(ctx, icons, yOffset, startX, scale) {
    let x = startX;
    for (let i = 0; i < icons.length; i++) {
        const iconName = icons[i];
        const iconPath = `./../../assets/dauntless/builds/${iconName}`;
        const icon = await loadImage(iconPath);
        const scaledWidth = 64 * scale;
        const scaledHeight = 64 * scale;
        ctx.drawImage(icon, x, yOffset, scaledWidth, scaledHeight);
        x += scaledWidth;
    }
}
