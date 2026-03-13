const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('wealthy')
        .setDescription('Shows the top 5 users with the most coins!')
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = path.resolve(__dirname, './../../database/data.json');

        // Read JSON file asynchronously
        let users = [];
        try {
            const data = await fs.readFile(jsonPath, 'utf8');
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

        // Check if there are users in the database
        if (topUsers.length === 0) {
            return interaction.reply({
                content: 'No users found in the database.',
                ephemeral: true,
            });
        }

        // Create the wealthy embed
        const topUsersInfo = topUsers.map((user, index) =>
            `\n${getRankEmoji(index + 1)} <@${user.user}> :coin: **${user.coins}** :performing_arts: **${user.karma}**`,
        ).join('\n');

        const embed = new EmbedBuilder().setDescription(topUsersInfo);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

function getRankEmoji(rank) {
    switch (rank) {
        case 1: return emoji.first;
        case 2: return emoji.second;
        case 3: return emoji.third;
        default: return `**${rank}.**`;
    }
}
