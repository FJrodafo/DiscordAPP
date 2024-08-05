const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top 5 users with the most coins!'),
    async execute(interaction) {
        const jsonPath = './../../database/data.json';

        // Read JSON file
        let users = [];
        try {
            const data = fs.readFileSync(jsonPath, 'utf8');
            users = JSON.parse(data);
        }
        catch (err) {
            console.error('Error reading data.json:', err);
            return interaction.reply({
                content: 'There was an error reading the database.',
                ephemeral: true,
            });
        }

        // Sort users by coins in descending order
        users.sort((a, b) => b.coins - a.coins);

        // Get the top 5 users
        const topUsers = users.slice(0, 5);

        // Create the leaderboard embed
        const topUsersInfo = topUsers.map((user, index) => (`\n${getRankEmoji(index + 1)} <@${user.user}> ${user.coins} coins`)).join('\n');
        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription(topUsersInfo);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

function getRankEmoji(rank) {
    switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `**${rank}.**`;
    }
}
