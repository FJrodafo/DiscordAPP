const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Display info about this server!')
        .setDMPermission(false),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .addFields(
                { name: 'Server Name:', value: `${interaction.guild.name}`, inline: true },
                { name: 'ID:', value: `${interaction.guild.id}`, inline: true },
                { name: 'Total members:', value: `${interaction.guild.memberCount}`, inline: true },
                { name: 'Created at:', value: `${interaction.guild.createdAt}`, inline: false },
            );
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
