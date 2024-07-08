const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Ship')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(`${interaction.user} shipped with ${interaction.targetUser} and it is ${Math.floor(Math.random() * 100) + 1}%`);
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        message.react('💞');
    },
};
