const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them (but not really).')
        .setDefaultMemberPermissions(0)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to kick')
            .setRequired(true),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        return interaction.reply({ content: `You wanted to kick: ${user} :scales:`, ephemeral: true });
    },
};
