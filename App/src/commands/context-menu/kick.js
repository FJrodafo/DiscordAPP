const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Kick')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        return interaction.reply({ content: `You wanted to kick: ${interaction.targetUser.username}`, ephemeral: true });
    },
};
