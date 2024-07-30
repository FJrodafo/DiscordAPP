const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.')
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.member;
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setThumbnail(`${interaction.user.displayAvatarURL()}`)
            .addFields(
                { name: 'User Name:', value: `${user.username}`, inline: true },
                { name: 'ID:', value: `${user.id}`, inline: true },
                { name: 'Joined at:', value: `${member.joinedAt}`, inline: false },
            );
        return interaction.reply({ embeds: [embed] });
    },
};
