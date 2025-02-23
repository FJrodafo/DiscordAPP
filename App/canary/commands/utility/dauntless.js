const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');
const {
    createCanvas,
    loadImage,
} = require('canvas');
const fs = require('fs');
const path = require('path');
const emoji = require('./../../utils/emoji.js');
process.chdir(__dirname);

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dauntless')
        .setDescription('A collection of Dauntless commands!')
        .setDMPermission(false)
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
        )
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName('leaderboards')
            .setDescription('A collection of Dauntless leaderboards!')
            .addSubcommand(subcommand => subcommand
                .setName('trials')
                .setDescription('Provides information on the best players in Trials!')
                .addStringOption(option => option
                    .setName('mode')
                    .setDescription('Select the mode.')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Solo', value: 'solo' },
                        { name: 'Group', value: 'group' },
                    ),
                )
                .addIntegerOption(option => option
                    .setName('week')
                    .setDescription('The week number you want to view.')
                    .setRequired(true),
                ),
            )
            .addSubcommand(subcommand => subcommand
                .setName('gauntlet')
                .setDescription('Provides information on the best guilds in Gauntlet!')
                .addIntegerOption(option => option
                    .setName('season')
                    .setDescription('The season number you want to view.')
                    .setRequired(true),
                ),
            ),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        if (subcommand === 'meta-builds') { await handleMetaBuilds(interaction); }
        else if (subcommandGroup === 'leaderboards') {
            if (subcommand === 'trials') {
                const mode = interaction.options.getString('mode');
                const week = interaction.options.getInteger('week');
                if (week < 1 || week > 107) return interaction.reply({ content: 'You need to input a number between `1` and `107`', ephemeral: true });
                const jsonPath = `./../../database/dauntless/trials/${mode}/week${week}.json`;
                const leaderboardData = require(jsonPath);
                if (mode === 'solo') await handleTrialsSoloPagination(interaction, leaderboardData);
                else await handleTrialsGroupPagination(interaction, leaderboardData);
            }
            else if (subcommand === 'gauntlet') {
                const season = interaction.options.getInteger('season');
                if (season < 1 || season > 18) return interaction.reply({ content: 'You need to input a number between `1` and `18`', ephemeral: true });
                const jsonPath = `./../../database/dauntless/gauntlet/season${season}.json`;
                const leaderboardData = require(jsonPath);
                await handleGauntletPagination(interaction, leaderboardData.leaderboard);
            }
        }
    },
};

async function handleMetaBuilds(interaction) {
    const weapon = interaction.options.getString('weapon');
    const element = interaction.options.getString('element');
    const jsonPath = './../../database/dauntless/meta-builds.json';
    const data = require(jsonPath);
    const buildInfo = data[weapon][element];
    const thumbnailPath = path.resolve(__dirname, `./../../assets/dauntless/builds/${buildInfo.omnicell}`);
    const imagePath = path.resolve(__dirname, './../../assets/command-output/meta-builds.png');
    const combinedImage = await combineImages(buildInfo.weapon, buildInfo.armor, buildInfo.supplies);
    fs.writeFileSync(imagePath, combinedImage.toBuffer());
    const thumbnailFile = new AttachmentBuilder(thumbnailPath);
    const imageFile = new AttachmentBuilder(imagePath);
    let embed;
    if (buildInfo.best) embed = new EmbedBuilder().setTitle(`${buildInfo.name} Meta Build:`).setDescription(buildInfo.perks.join('\n')).setThumbnail(`attachment://${buildInfo.omnicell}`).setImage('attachment://meta-builds.png').setFooter({ text: `${buildInfo.best}` });
    else embed = new EmbedBuilder().setTitle(`${buildInfo.name} Meta Build:`).setDescription(buildInfo.perks.join('\n')).setThumbnail(`attachment://${buildInfo.omnicell}`).setImage('attachment://meta-builds.png');
    await interaction.reply({ embeds: [embed], files: [thumbnailFile, imageFile], ephemeral: true });
}

async function handleTrialsSoloPagination(interaction, leaderboardData) {
    await handleLeaderboardsPagination(interaction, leaderboardData, 'Trials.png', (item, rank) =>
        `\n${getRankEmoji(rank)} **${item.platform_name}** [${item.platform}]\nWeapon: **${getWeapon(item.weapon)}**\nCompletion Time: **${formatTimeMiliseconds(item.completion_time)}**`,
    );
}

async function handleTrialsGroupPagination(interaction, leaderboardData) {
    await handleLeaderboardsPagination(interaction, leaderboardData, 'Trials.png', (item, rank) => {
        const teamMembers = item.entries.map(entry =>
            `- **${entry.platform_name}** [${entry.platform}] Weapon: **${getWeapon(entry.weapon)}**`,
        ).join('\n');
        return `\n${getRankEmoji(rank)} Completion Time: **${formatTimeMiliseconds(item.completion_time)}**\n${teamMembers}`;
    });
}

async function handleGauntletPagination(interaction, leaderboardData) {
    await handleLeaderboardsPagination(interaction, leaderboardData, 'Gauntlet.png', (item, rank) =>
        `\n${getRankEmoji(rank)} **${item.guild_name}** [${item.guild_nameplate}]\nLevel: **${item.level}** Time Left: **${formatTimeSeconds(item.remaining_sec)}**`,
    );
}

// https://storage.googleapis.com/dauntless-gauntlet-leaderboard/production-gauntlet-season08.json
async function handleLeaderboardsPagination(interaction, leaderboardData, imageName, formatItem) {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
    let currentPage = 0;

    const generateEmbed = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const items = leaderboardData.slice(start, end);

        const description = items.map((item, index) => formatItem(item, start + index + 1)).join('\n');

        return new EmbedBuilder().setThumbnail(`attachment://${imageName}`).setDescription(description).setFooter({ text: `Page ${page + 1} of ${totalPages}` });
    };

    const firstPageButton = new ButtonBuilder().setCustomId('first-page-button').setLabel(emoji.arrow_up).setStyle(ButtonStyle.Primary).setDisabled(true);
    const backButton = new ButtonBuilder().setCustomId('back-button').setLabel(emoji.arrow_left).setStyle(ButtonStyle.Primary).setDisabled(true);
    const nextButton = new ButtonBuilder().setCustomId('next-button').setLabel(emoji.arrow_right).setStyle(ButtonStyle.Primary).setDisabled(totalPages <= 1);
    const lastPageButton = new ButtonBuilder().setCustomId('last-page-button').setLabel(emoji.arrow_down).setStyle(ButtonStyle.Primary).setDisabled(totalPages <= 1);

    const buttonRow = new ActionRowBuilder().addComponents(firstPageButton, backButton, nextButton, lastPageButton);

    const iconPath = path.resolve(__dirname, `./../../assets/dauntless/leaderboards/${imageName}`);
    const iconFile = new AttachmentBuilder(iconPath);

    const reply = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [buttonRow],
        files: [iconFile],
        ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: 120_000,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'first-page-button') currentPage = 0;
        if (i.customId === 'back-button') currentPage--;
        if (i.customId === 'next-button') currentPage++;
        if (i.customId === 'last-page-button') currentPage = totalPages - 1;

        firstPageButton.setDisabled(currentPage === 0);
        backButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === totalPages - 1);
        lastPageButton.setDisabled(currentPage === totalPages - 1);

        await i.update({
            embeds: [generateEmbed(currentPage)],
            components: [buttonRow],
        });
    });

    collector.on('end', async () => {
        firstPageButton.setDisabled(true);
        backButton.setDisabled(true);
        nextButton.setDisabled(true);
        lastPageButton.setDisabled(true);

        await interaction.editReply({
            components: [buttonRow],
        });
    });
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
    for (const iconName of icons) {
        const iconPath = `./../../assets/dauntless/builds/${iconName}`;
        try {
            const icon = await loadImage(iconPath);
            const scaledWidth = 64 * scale;
            const scaledHeight = 64 * scale;
            ctx.drawImage(icon, x, yOffset, scaledWidth, scaledHeight);
            x += scaledWidth;
        }
        catch (error) {
            console.error(`Error loading image ${iconName}:`, error);
        }
    }
}

function getRankEmoji(rank) {
    switch (rank) {
        case 1: return emoji.first;
        case 2: return emoji.second;
        case 3: return emoji.third;
        default: return `**${rank}.**`;
    }
}

function getWeapon(rank) {
    switch (rank) {
        case 1: return 'Hammer';
        case 2: return 'Axe';
        case 3: return 'Sword';
        case 4: return 'Chain Blades';
        case 5: return 'War Pike';
        case 6: return 'Repeaters';
        case 7: return 'Aether Strikers';
        default: return 'Bow';
    }
}

function formatTimeMiliseconds(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatTimeSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
