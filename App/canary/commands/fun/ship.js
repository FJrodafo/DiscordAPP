const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'fun',
    cooldown: 86_400,
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Find your better half!')
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Mention a user!')
            .setRequired(true),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(`${interaction.user} shipped with ${user} and it is ${randomNumber}%`);

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        if (message.channel && randomNumber > 90) message.react('💘');
        if (message.channel && randomNumber >= 80 && randomNumber <= 90) message.react('💖');
        if (message.channel && randomNumber >= 10 && randomNumber < 80) message.react('❤️');
        if (message.channel && randomNumber < 10) message.react('💔');
    },
};
