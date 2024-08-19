const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    cooldown: 28_800,
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn daily coins!')
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = './../../database/data.json';
        const user = interaction.user;

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

        // Check if the user is already registered
        const userId = user.id.toString();
        const userExists = users.find(u => u.user === userId);

        // If the user is not registered, send a message to register
        if (!userExists) return interaction.reply({ content: 'To register use: `/register`', ephemeral: true });

        // Update user coins
        userExists.coins += 40;

        // Save the updated JSON file
        try {
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            console.log(`${user.id} coins updated in data.json`);
        }
        catch (err) {
            console.error('Error writing to data.json:', err);
            return interaction.reply({
                content: 'There was an error updating the database.',
                ephemeral: true,
            });
        }

        // Final result
        const embed = new EmbedBuilder().setDescription('You have earned `40` coins!');

        return interaction.reply({ embeds: [embed] });
    },
};
