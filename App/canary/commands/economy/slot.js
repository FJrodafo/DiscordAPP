const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('One coin per pull!')
        .addSubcommand(subcommand => subcommand
            .setName('payout')
            .setDescription('Provides information about payouts!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('machine')
            .setDescription('Pull the classic Liberty Bell slot machine!'),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        const jsonPath = './../../database/data.json';
        const user = interaction.user;

        if (subcommand === 'payout') {
            const payoutEmbed = new EmbedBuilder().setDescription('Three Bells :bell: 10\nFlush of - - :hearts: 8\nFlush of - - :diamonds: 6\nFlush of - - :spades: 4\nTwo :gear: :gear: and :boom: 2\nTwo :gear: :gear: 1');
            return interaction.reply({ embeds: [payoutEmbed], ephemeral: true });
        }
        else if (subcommand === 'machine') {
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
            if (userExists.coins < 1) return interaction.reply({ content: 'You don\'t have enough coins to play. Use `/work` to earn coins!', ephemeral: true });

            // Deposit 1 coin to pull the lever
            userExists.coins -= 1;

            const slots = [':gear:', ':boom:', ':spades:', ':diamonds:', ':hearts:', ':bell:'];

            const getRandomSlots = () => {
                const result1 = Math.floor(Math.random() * slots.length);
                const result2 = Math.floor(Math.random() * slots.length);
                const result3 = Math.floor(Math.random() * slots.length);
                return [slots[result1], slots[result2], slots[result3]];
            };

            let payout = 0;
            let title = 'YOU LOST';
            let footerText = 'Try again!';

            // Store the result for checking
            const finalResult = getRandomSlots();
            const [finalSlot1, finalSlot2, finalSlot3] = finalResult;

            // Send the initial response
            let randomSlots = getRandomSlots();
            const embed = new EmbedBuilder()
                .setTitle('SPINNING')
                .setDescription(randomSlots.join(' '))
                .setFooter({ text: '...' });
            await interaction.reply({ embeds: [embed] });

            // Animation loop
            for (let i = 0; i < 8; i++) {
                randomSlots = getRandomSlots();
                embed.setTitle('SPINNING')
                    .setDescription(randomSlots.join(' '))
                    .setFooter({ text: '...' });
                await interaction.editReply({ embeds: [embed] });
                // Wait 200ms for animation effect
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Determine payout based on the final result
            if ((finalSlot1 === ':gear:' && finalSlot2 === ':gear:' && finalSlot3 !== ':gear:' && finalSlot3 !== ':boom:') ||
                (finalSlot1 === ':gear:' && finalSlot2 !== ':gear:' && finalSlot2 !== ':boom:' && finalSlot3 === ':gear:') ||
                (finalSlot1 !== ':gear:' && finalSlot1 !== ':boom:' && finalSlot2 === ':gear:' && finalSlot3 === ':gear:')) {
                payout = 1;
            }
            else if ((finalSlot1 === ':gear:' && finalSlot2 === ':gear:' && finalSlot3 === ':boom:') ||
                (finalSlot1 === ':gear:' && finalSlot2 === ':boom:' && finalSlot3 === ':gear:') ||
                (finalSlot1 === ':boom:' && finalSlot2 === ':gear:' && finalSlot3 === ':gear:')) {
                payout = 2;
            }
            else if (finalSlot1 === ':spades:' && finalSlot2 === ':spades:' && finalSlot3 === ':spades:') {
                payout = 4;
            }
            else if (finalSlot1 === ':diamonds:' && finalSlot2 === ':diamonds:' && finalSlot3 === ':diamonds:') {
                payout = 6;
            }
            else if (finalSlot1 === ':hearts:' && finalSlot2 === ':hearts:' && finalSlot3 === ':hearts:') {
                payout = 8;
            }
            else if (finalSlot1 === ':bell:' && finalSlot2 === ':bell:' && finalSlot3 === ':bell:') {
                payout = 10;
            }

            if (payout > 0) {
                userExists.coins += payout;
                title = 'YOU WIN!';
                if (payout === 1) footerText = `Pay of ${payout} coin!`;
                else footerText = `Pay of ${payout} coins!`;
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

            // Final result
            embed.setTitle(title)
                .setDescription(finalResult.join(' '))
                .setFooter({ text: footerText });
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
