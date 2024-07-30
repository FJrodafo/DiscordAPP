const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Display info about this server!')
        .setDMPermission(false),
    async execute(interaction) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setThumbnail(`${guild.iconURL()}`)
            .addFields(
                { name: 'Server Name:', value: `${guild.name}`, inline: true },
                { name: 'ID:', value: `${guild.id}`, inline: true },
                { name: 'Total members:', value: `${guild.memberCount}`, inline: true },
                { name: 'Created at:', value: `${guild.createdAt}`, inline: false },
            );
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
