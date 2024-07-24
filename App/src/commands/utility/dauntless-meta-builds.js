const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const jsonPath = './../../data/dauntless-meta-builds.json';
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
                { name: 'Aether Strikers', value: 'Aether Strikers' },
                { name: 'Axe', value: 'Axe' },
                { name: 'Chain Blades', value: 'Chain Blades' },
                { name: 'Hammer', value: 'Hammer' },
                { name: 'Repeaters', value: 'Repeaters' },
                { name: 'Sword', value: 'Sword' },
                { name: 'War Pike', value: 'War Pike' },
            ),
        )
        .addStringOption(option => option
            .setName('element')
            .setDescription('Select an element')
            .setRequired(true)
            .addChoices(
                { name: 'Shock', value: 'Shock' },
                { name: 'Blaze', value: 'Blaze' },
                { name: 'Umbral', value: 'Umbral' },
                { name: 'Terra', value: 'Terra' },
                { name: 'Frost', value: 'Frost' },
                { name: 'Radiant', value: 'Radiant' },
            ),
        ),
    async execute(interaction) {
        const weapon = interaction.options.getString('weapon');
        const element = interaction.options.getString('element');
        const data = require(jsonPath);
        const buildInfo = data[weapon][element];
        const thumbnailPath = `./../../assets/dauntless/builds/${buildInfo.Omnicell}`;
        const imagePath = './dauntless-meta-builds.png';
        const combinedImage = await combineImages(buildInfo.Weapon, buildInfo.Armour, buildInfo.Supplies);
        fs.writeFileSync(imagePath, combinedImage.toBuffer());
        const thumbnailFile = new AttachmentBuilder(thumbnailPath);
        const imageFile = new AttachmentBuilder(imagePath);
        let embed;
        if (buildInfo.Best) {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${element} ${weapon} Meta Build:`)
                .setDescription(buildInfo.Perks.join('\n'))
                .setThumbnail(`attachment://${buildInfo.Omnicell}`)
                .setImage('attachment://dauntless-meta-builds.png')
                .setFooter({ text: `${buildInfo.Best}` });
        }
        else {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${element} ${weapon} Meta Build:`)
                .setDescription(buildInfo.Perks.join('\n'))
                .setThumbnail(`attachment://${buildInfo.Omnicell}`)
                .setImage('attachment://dauntless-meta-builds.png');
        }
        interaction.reply({ embeds: [embed], files: [thumbnailFile, imageFile] });
    },
};

async function combineImages(weapon, armour, supplies) {
    const canvas = createCanvas(320, 180);
    const ctx = canvas.getContext('2d');
    const weaponRowStartX = (canvas.width - weapon.length * 64) / 2;
    const suppliesRowStartX = (canvas.width - supplies.length * 32) / 2;
    if (weapon.length !== 5) await drawIcons(ctx, weapon, 0, weaponRowStartX, 1);
    else await drawIcons(ctx, weapon, 0, 0, 1);
    await drawIcons(ctx, armour, 74, 0, 1);
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
