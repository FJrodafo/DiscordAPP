const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        return interaction.reply({ content: `${interaction.targetUser.username}'s [avatar](${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 512 })})`, ephemeral: true });
    },
};
