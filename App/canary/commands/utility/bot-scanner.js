const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('bot-scanner')
        .setDescription('Are you a bot?')
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Type a user!')
            .setRequired(false),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        let embed;

        if (user.bot) {
            embed = new EmbedBuilder().setAuthor({
                name: 'is a BOT!',
                iconURL: `${user.displayAvatarURL()}`,
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            embed = new EmbedBuilder().setAuthor({
                name: 'is not a BOT.',
                iconURL: `${user.displayAvatarURL()}`,
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
