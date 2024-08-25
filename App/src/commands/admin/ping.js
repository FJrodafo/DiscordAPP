const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'admin',
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        await interaction.reply({ content: 'pong', ephemeral: true });
    },
};
