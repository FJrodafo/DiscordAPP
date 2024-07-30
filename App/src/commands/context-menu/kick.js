const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Kick')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        return interaction.reply({ content: `You wanted to kick: ${interaction.targetUser} :scales:`, ephemeral: true });
    },
};
