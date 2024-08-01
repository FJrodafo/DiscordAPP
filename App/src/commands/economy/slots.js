const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('One coin per pull!'),
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

        // Check if the user has enough coins
        if (userExists.coins < 1) return interaction.reply({ content: 'No tienes suficientes monedas para jugar.', ephemeral: true });

        // Deposit 1 coin to pull the lever
        userExists.coins -= 1;

        const slots = [':gear:', ':boom:', ':spades:', ':diamonds:', ':hearts:', ':bell:'];
        const result1 = Math.floor((Math.random() * slots.length));
        const result2 = Math.floor((Math.random() * slots.length));
        const result3 = Math.floor((Math.random() * slots.length));

        let payout = 0;
        let title = 'YOU LOST';
        let footerText = 'Try again!';

        if (slots[result1] === ':gear:' && slots[result2] === ':gear:' && slots[result3] !== ':gear:') {
            payout = 1;
        }
        else if ((slots[result1] === ':gear:' && slots[result2] === ':gear:' && slots[result3] === ':boom:') ||
            (slots[result1] === ':gear:' && slots[result2] === ':boom:' && slots[result3] === ':gear:') ||
            (slots[result1] === ':boom:' && slots[result2] === ':gear:' && slots[result3] === ':gear:')) {
            payout = 2;
        }
        else if (slots[result1] === ':spades:' && slots[result1] === slots[result2] && slots[result1] === slots[result3]) {
            payout = 4;
        }
        else if (slots[result1] === ':diamonds:' && slots[result1] === slots[result2] && slots[result1] === slots[result3]) {
            payout = 6;
        }
        else if (slots[result1] === ':hearts:' && slots[result1] === slots[result2] && slots[result1] === slots[result3]) {
            payout = 8;
        }
        else if (slots[result1] === ':bell:' && slots[result1] === slots[result2] && slots[result1] === slots[result3]) {
            payout = 10;
        }

        if (payout > 0) {
            userExists.coins += payout;
            title = 'YOU WIN!';
            footerText = `Pay of ${payout} coins!`;
        }

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

        // Result
        const embed = new EmbedBuilder()
            .setDescription(slots[result1] + slots[result2] + slots[result3])
            .setFooter({ text: footerText })
            .setTitle(title);
        return interaction.reply({ embeds: [embed] });
    },
};
