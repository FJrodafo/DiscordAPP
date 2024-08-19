const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('f')
        .setDescription('Press F to pay respect.')
        .setDMPermission(false),
    async execute(interaction) {
        const message = await interaction.reply({ content: 'Press F to pay respect.', fetchReply: true });
        if (message.channel) message.react('🇫');
    },
};
