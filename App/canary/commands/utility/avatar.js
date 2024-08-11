const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar!')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The user\'s avatar to show')
            .setRequired(false),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        if (user) return interaction.reply(`${user.username}'s [avatar](${user.displayAvatarURL({ dynamic: true, size: 512 })})`);
        else return interaction.reply(`Your [avatar](${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })})`);
    },
};
