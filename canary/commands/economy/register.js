const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register if you are not yet registered in the database!')
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = path.resolve(__dirname, './../../database/data.json');
        const logPath = path.resolve(__dirname, './../../database/log.txt');

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

        // Check if the user is already registered
        const userId = interaction.user.id.toString();
        const userExists = users.find(u => u.user === userId);

        if (userExists) {
            return interaction.reply({
                content: 'You are already registered.',
                ephemeral: true,
            });
        }

        // Register user
        const newUser = {
            id: users.length + 1,
            user: userId,
            karma: 0,
            coins: 0,
        };
        users.push(newUser);

        // Save the updated JSON file and log the registration asynchronously
        try {
            await fs.writeFile(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            const date = new Date(), timestamp = date.toLocaleString();
            const logMessage = `${timestamp} - ${interaction.user.id} was successfully registered and added to data.json\n`;
            await fs.appendFile(logPath, logMessage, 'utf8');
        }
        catch (err) {
            console.error('Error writing to data.json/log.txt:', err);
            return interaction.reply({
                content: 'There was an error updating the database.',
                ephemeral: true,
            });
        }

        // Success message!
        return interaction.reply({
            content: 'You have been successfully registered!',
            ephemeral: true,
        });
    },
};
