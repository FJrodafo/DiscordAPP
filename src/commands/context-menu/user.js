const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('User')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.targetUser;
        const member = interaction.targetMember;
        const embed = new EmbedBuilder()
            .setThumbnail(`${user.displayAvatarURL()}`)
            .addFields(
                { name: 'User:', value: `${user.username}`, inline: true },
                { name: 'ID:', value: `${user.id}`, inline: true },
                { name: 'Joined at:', value: `${member.joinedAt}`, inline: false },
            );

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
