const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Spin the roulette!')
        .addStringOption(option => option
            .setName('bet')
            .setDescription('Place your bet!')
            .setRequired(true)
            .addChoices(
                { name: '5 Coins', value: '5' },
                { name: '10 Coins', value: '10' },
                { name: '20 Coins', value: '20' },
                { name: '50 Coins', value: '50' },
                { name: '100 Coins', value: '100' },
                { name: '200 Coins', value: '200' },
                { name: '500 Coins', value: '500' },
            ),
        )
        .addStringOption(option => option
            .setName('color')
            .setDescription('Choose a color!')
            .setRequired(true)
            .addChoices(
                { name: '🟢 Green', value: 'green' },
                { name: '🔴 Red', value: 'red' },
                { name: '⚫ Black', value: 'black' },
            ),
        ),
    async execute(interaction) {
        const bet = parseInt(interaction.options.getString('bet'));
        const color = interaction.options.getString('color');
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
        if (userExists.coins < bet) return interaction.reply({ content: 'You don\'t have enough coins to place this bet. Use `/work` to earn coins!', ephemeral: true });

        // Place the bet
        userExists.coins -= bet;

        // Roulette odds
        const roulette = Array(18).fill('red').concat(Array(18).fill('black'), 'green');
        const result = roulette[Math.floor(Math.random() * roulette.length)];

        let payout = 0;

        // Determine the outcome of the bet
        if (result === color) {
            if (color === 'green') payout = bet * 10;
            else payout = bet * 2;
        }

        // Add profit
        if (payout > 0) userExists.coins += payout;

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
        const resultText = payout > 0 ? `You won ${payout - bet} coins!` : 'You lost your bet. Better luck next time!';
        const imagePath = './../../assets/casino/Roulette.gif';
        const imageFile = new AttachmentBuilder(imagePath);
        const embed = new EmbedBuilder()
            .setTitle('Roulette')
            .setDescription(resultText)
            .setImage('attachment://Roulette.gif')
            .addFields(
                { name: 'Your bet:', value: `${bet} coins`, inline: true },
                { name: 'Your choice:', value: `${color === 'green' ? '🟢 Green' : color === 'red' ? '🔴 Red' : '⚫ Black'}`, inline: true },
                { name: 'Result:', value: `${result === 'green' ? '🟢 Green' : result === 'red' ? '🔴 Red' : '⚫ Black'}`, inline: true },
            );

        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};
