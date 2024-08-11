const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'fun',
    // 60 seconds
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};
