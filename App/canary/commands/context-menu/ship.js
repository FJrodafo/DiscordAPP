const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    cooldown: 86_400,
    data: new ContextMenuCommandBuilder()
        .setName('Ship')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(`${interaction.user} shipped with ${interaction.targetUser} and it is ${randomNumber}%`);

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        if (message.channel && randomNumber > 90) message.react('💘');
        if (message.channel && randomNumber >= 80 && randomNumber <= 90) message.react('💖');
        if (message.channel && randomNumber >= 10 && randomNumber < 80) message.react('❤️');
        if (message.channel && randomNumber < 10) message.react('💔');
    },
};
