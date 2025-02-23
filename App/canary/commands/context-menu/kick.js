const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Kick')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({ content: `You wanted to kick: ${interaction.targetUser} :scales:`, ephemeral: true });
    },
};
