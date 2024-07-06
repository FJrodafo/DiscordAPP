const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const jsonPath = '../../data/mhfu.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mhfu')
        .setDescription('Monster ecodata!')
        .addStringOption(option => option
            .setName('monster')
            .setDescription('Select a monster')
            .setRequired(true)
            .addChoices(
                { name: 'Felyne アイルー (Airū)', value: 'Felyne' },
                { name: 'Melynx メラルー (Merarū)', value: 'Melynx' },
                { name: 'Shakalaka チャチャブー (Chachabū)', value: 'Shakalaka' },
                { name: 'King Shakalaka キングチャチャブー (Kingu Chachabū)', value: 'King Shakalaka' },
            ),
        ),
    async execute(interaction) {
        const monster = interaction.options.getString('monster');
        const data = require(jsonPath);
        const monsterInfo = data[monster];
        const thumbnailPath = `./../../assets/mhfu/monsters/${monsterInfo.Icon}`;
        const thumbnailFile = new AttachmentBuilder(thumbnailPath);
        let embed;
        if (monsterInfo.Description) {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${monsterInfo.Name}`)
                .setDescription(`${monsterInfo.Description}`)
                .addFields(
                    { name: 'Monster Class:', value: `${monsterInfo.Class}`, inline: true },
                    { name: 'Size:', value: `${monsterInfo.Size}`, inline: true },
                    { name: 'Habitat:', value: `${monsterInfo.Habitat}`, inline: true },
                    { name: 'Elements:', value: `${monsterInfo.Elements}`, inline: true },
                    { name: 'Ailments:', value: `${monsterInfo.Ailments}`, inline: true },
                    { name: 'Weakest to:', value: `${monsterInfo.Weakness}`, inline: true },
                )
                .setThumbnail(`attachment://${monsterInfo.Icon}`);
        }
        else {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`${monsterInfo.Name}`)
                .addFields(
                    { name: 'Monster Class:', value: `${monsterInfo.Class}`, inline: true },
                    { name: 'Size:', value: `${monsterInfo.Size}`, inline: true },
                    { name: 'Habitat:', value: `${monsterInfo.Habitat}`, inline: true },
                    { name: 'Elements:', value: `${monsterInfo.Elements}`, inline: true },
                    { name: 'Ailments:', value: `${monsterInfo.Ailments}`, inline: true },
                    { name: 'Weakest to:', value: `${monsterInfo.Weakness}`, inline: true },
                )
                .setThumbnail(`attachment://${monsterInfo.Icon}`);
        }
        interaction.reply({ embeds: [embed], files: [thumbnailFile] });
    },
};
