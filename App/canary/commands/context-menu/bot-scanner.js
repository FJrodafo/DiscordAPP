const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Bot-Scanner')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        let embed;

        if (interaction.targetUser.bot) {
            embed = new EmbedBuilder().setAuthor({
                name: 'is a BOT!',
                iconURL: `${interaction.targetUser.displayAvatarURL()}`,
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            embed = new EmbedBuilder().setAuthor({
                name: 'is not a BOT.',
                iconURL: `${interaction.targetUser.displayAvatarURL()}`,
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
