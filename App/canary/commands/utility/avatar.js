const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user or your own avatar!')
        .setDMPermission(false)
        .addIntegerOption(option => option
            .setName('size')
            .setDescription('Select the image size!')
            .setRequired(true)
            .addChoices(
                { name: '16x16', value: 16 },
                { name: '32x32', value: 32 },
                { name: '64x64', value: 64 },
                { name: '128x128', value: 128 },
                { name: '256x256', value: 256 },
                { name: '512x512', value: 512 },
                { name: '1024x1024', value: 1024 },
            ),
        )
        .addUserOption(option => option
            .setName('target')
            .setDescription('Choose a user!')
            .setRequired(false),
        ),
    async execute(interaction) {
        const size = interaction.options.getInteger('size');
        const user = interaction.options.getUser('target') || interaction.user;
        const userAvatar = user
            .displayAvatarURL({ dynamic: true, size: size })
            .replace('webp', 'png');

        await interaction.reply({ content: userAvatar, ephemeral: true });
    },
};
