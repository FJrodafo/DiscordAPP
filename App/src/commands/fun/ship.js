const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Find your better half!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Mention a user!')
            .setRequired(true),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(`${interaction.user} shipped with ${user} and it is ${Math.floor(Math.random() * 100) + 1}%`);
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        if (message.channel) message.react('💞');
    },
};
