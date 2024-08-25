const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'admin',
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Roundtrip latency: **${sent.createdTimestamp - interaction.createdTimestamp}**ms`);
        // await interaction.reply({ content: 'pong', ephemeral: true });
    },
};
