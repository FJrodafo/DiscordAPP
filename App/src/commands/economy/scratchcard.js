const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('scratchcard')
        .setDescription('Ten coins per card!'),
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
        if (userExists.coins < 10) return interaction.reply({ content: 'You don\'t have enough coins to play. Use `/work` to earn coins!', ephemeral: true });

        // Discount 10 coins for the scratchcard
        userExists.coins -= 10;

        // Game mechanics
        const randomMessage = () => Math.random() < 0.4 ? '||:money_with_wings:||' : '||:cloud:||';
        const randomMessageBonus = () => Math.random() < 0.4 ? '||:white_check_mark:||' : '||:negative_squared_cross_mark:||';

        // Generate the scratchcard result
        const scratchResults = Array.from({ length: 16 }, randomMessage);
        const bonusResult = randomMessageBonus();

        // Calculate the profit
        const moneyCount = scratchResults.filter(result => result === '||:money_with_wings:||').length;
        let totalWinnings = moneyCount;
        if (bonusResult === '||:white_check_mark:||') totalWinnings *= 2;

        // Update user coins
        userExists.coins += totalWinnings;

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
        const embed = new EmbedBuilder()
            .setColor(0x74B454)
            .setDescription(`${scratchResults[0]} ${scratchResults[1]} ${scratchResults[2]} ${scratchResults[3]} ${scratchResults[4]} ${scratchResults[5]}\n${scratchResults[6]} ${scratchResults[7]} ${scratchResults[8]} ${scratchResults[9]} ${scratchResults[10]} ${scratchResults[11]}`)
            .setTitle('The value of each :money_with_wings: is 1$')
            .addFields(
                { name: 'BONUS!', value: `${scratchResults[12]} ${scratchResults[13]} ${scratchResults[14]} ${scratchResults[15]}`, inline: true },
                { name: 'x2', value: `${bonusResult}`, inline: true },
            );
        return interaction.reply({ embeds: [embed] });
    },
};
