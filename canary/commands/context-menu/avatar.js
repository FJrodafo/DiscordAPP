const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const userName = interaction.targetUser.username;
        const userAvatar = interaction.targetUser
            .displayAvatarURL({ dynamic: true })
            .replace('webp', 'png');

        await interaction.reply({ content: `[${userName}](${userAvatar})`, ephemeral: true });
    },
};
