const {
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them (but not really).')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('target')
            .setDescription('The member to kick')
            .setRequired(true),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target');

        await interaction.reply({ content: `You wanted to kick: ${user} :scales:`, ephemeral: true });
    },
};
