const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
process.chdir(__dirname);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dauntless-meta-builds')
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
    async execute(interaction) {
        const weapon = interaction.options.getString('weapon');
        const element = interaction.options.getString('element');
        const jsonPath = './../../data/dauntless-meta-builds.json';
        const data = require(jsonPath);
        const buildInfo = data[weapon][element];
        const thumbnailPath = `./../../assets/dauntless/builds/${buildInfo.omnicell}`;
        const imagePath = './dauntless-meta-builds.png';
        const combinedImage = await combineImages(buildInfo.weapon, buildInfo.armor, buildInfo.supplies);
        fs.writeFileSync(imagePath, combinedImage.toBuffer());
        const thumbnailFile = new AttachmentBuilder(thumbnailPath);
        const imageFile = new AttachmentBuilder(imagePath);
        let embed;
        if (buildInfo.best) {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${element} ${weapon} Meta Build:`)
                .setDescription(buildInfo.perks.join('\n'))
                .setThumbnail(`attachment://${buildInfo.omnicell}`)
                .setImage('attachment://dauntless-meta-builds.png')
                .setFooter({ text: `${buildInfo.best}` });
        }
        else {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${element} ${weapon} Meta Build:`)
                .setDescription(buildInfo.perks.join('\n'))
                .setThumbnail(`attachment://${buildInfo.omnicell}`)
                .setImage('attachment://dauntless-meta-builds.png');
        }
        interaction.reply({ embeds: [embed], files: [thumbnailFile, imageFile] });
    },
};

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
