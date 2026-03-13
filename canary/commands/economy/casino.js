const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'economy',
    data: new SlashCommandBuilder()
        .setName('casino')
        .setDescription('A collection of Casino commands!')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('japan-world-cup')
            .setDescription('Bet on a horse and win!')
            .addIntegerOption(option => option
                .setName('bet')
                .setDescription('Place your bet!')
                .setRequired(true)
                .addChoices(
                    { name: '5 Coins', value: 5 },
                    { name: '10 Coins', value: 10 },
                    { name: '20 Coins', value: 20 },
                    { name: '50 Coins', value: 50 },
                    { name: '100 Coins', value: 100 },
                    { name: '200 Coins', value: 200 },
                    { name: '500 Coins', value: 500 },
                ),
            )
            .addIntegerOption(option => option
                .setName('horse')
                .setDescription('Choose a horse number!')
                .setRequired(true)
                .addChoices(
                    { name: 'One', value: 1 },
                    { name: 'Two', value: 2 },
                    { name: 'Three', value: 3 },
                    { name: 'Four', value: 4 },
                    { name: 'Five', value: 5 },
                    { name: 'Six', value: 6 },
                    { name: 'Seven', value: 7 },
                    { name: 'Eight', value: 8 },
                ),
            ),
        )
        .addSubcommand(subcommand => subcommand
            .setName('roulette')
            .setDescription('Spin the roulette!')
            .addIntegerOption(option => option
                .setName('bet')
                .setDescription('Place your bet!')
                .setRequired(true)
                .addChoices(
                    { name: '5 Coins', value: 5 },
                    { name: '10 Coins', value: 10 },
                    { name: '20 Coins', value: 20 },
                    { name: '50 Coins', value: 50 },
                    { name: '100 Coins', value: 100 },
                    { name: '200 Coins', value: 200 },
                    { name: '500 Coins', value: 500 },
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
        )
        .addSubcommand(subcommand => subcommand
            .setName('scratchcard')
            .setDescription('Ten coins per card!'),
        )
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName('slot')
            .setDescription('One coin per pull!')
            .addSubcommand(subcommand => subcommand
                .setName('machine')
                .setDescription('Pull the classic Liberty Bell slot machine!'),
            )
            .addSubcommand(subcommand => subcommand
                .setName('payout')
                .setDescription('Provides information about payouts!'),
            ),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

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

        // If the user is not registered, send a message to register
        if (!userExists) return interaction.reply({ content: 'To register use: `/register`', ephemeral: true });

        // Subcommand Handler
        if (subcommand === 'japan-world-cup') {
            await handleVirtualHorseRacing(interaction, userExists, users, jsonPath, logPath);
        }
        else if (subcommand === 'roulette') {
            await handleRoulette(interaction, userExists, users, jsonPath, logPath);
        }
        else if (subcommand === 'scratchcard') {
            await handleScratchcard(interaction, userExists, users, jsonPath, logPath);
        }
        else if (subcommandGroup === 'slot') {
            if (subcommand === 'payout') await handleSlotPayout(interaction);
            else if (subcommand === 'machine') await handleSlotMachine(interaction, userExists, users, jsonPath, logPath);
        }
    },
};

async function saveUpdatedJSON(interaction, users, jsonPath, logPath, bet, payout) {
    try {
        await fs.writeFile(jsonPath, JSON.stringify(users, null, 2), 'utf8');
        const date = new Date(), timestamp = date.toLocaleString();
        const logMessage = `${timestamp} - ${interaction.user.id} bet ${bet} coins and got a payout of ${payout} coins from casino.js\n`;
        await fs.appendFile(logPath, logMessage, 'utf8');
    }
    catch (err) {
        console.error('Error writing to data.json/log.txt:', err);
        return interaction.reply({
            content: 'There was an error updating the database.',
            ephemeral: true,
        });
    }
}

async function handleVirtualHorseRacing(interaction, userExists, users, jsonPath, logPath) {
    const bet = interaction.options.getInteger('bet');
    const selectedHorse = interaction.options.getInteger('horse');

    // Check if the user has enough coins
    if (userExists.coins < bet) return interaction.reply({ content: 'You don\'t have enough coins to place this bet. Use `/work` to earn coins!', ephemeral: true });

    // Place the bet
    userExists.coins -= bet;

    // Generate random positions for the horses
    const horsePositions = Array.from({ length: 8 }, (_, i) => i + 1);
    function fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    fisherYatesShuffle(horsePositions);

    // Emojis
    const rankingEmojis = [emoji.first, emoji.second, emoji.third, '**4th**', '**5th**', '**6th**', '**7th**', '**8th**'];
    const horseEmojis = [emoji[1], emoji[2], emoji[3], emoji[4], emoji[5], emoji[6], emoji[7], emoji[8]];

    // Determine the outcome of the race
    let payout = 0;
    let resultText = '';
    const position = horsePositions.indexOf(selectedHorse) + 1;
    if (position === 1) {
        payout = bet * 5;
        resultText = `Your horse finished in \`first\` place!\nYou have won \`${payout}\` coins!`;
    }
    else if (position === 2) {
        payout = bet * 3;
        resultText = `Your horse finished in \`second\` place!\nYou have won \`${payout}\` coins!`;
    }
    else if (position === 3) {
        payout = bet * 2;
        resultText = `Your horse finished in \`third\` place!\nYou have won \`${payout}\` coins!`;
    }
    else {
        resultText = `Your horse finished in \`${position}th\` position.\nYou have lost \`${bet}\` coins...\nBetter luck next time!`;
    }

    // Add profit
    if (payout > 0) userExists.coins += payout;

    // Save the updated JSON file and log the registration
    saveUpdatedJSON(interaction, users, jsonPath, logPath, bet, payout);

    // Create fields for the leaderboard
    const leaderboardFields = horsePositions.map((pos, index) => {
        return {
            name: `${rankingEmojis[index]} 🏇${horseEmojis[pos - 1]}`,
            value: '\u200B',
            inline: true,
        };
    });

    // Final result
    const imageFile = new AttachmentBuilder(
        path.resolve(__dirname, `./../../assets/economy/casino/japan-world-cup/${horsePositions[0]}.gif`),
    );
    const embed = new EmbedBuilder()
        .setTitle('Japan World Cup!')
        .setDescription(`${resultText}`)
        .addFields(leaderboardFields)
        .setImage(`attachment://${horsePositions[0]}.gif`)
        .setTimestamp()
        .setFooter({ text: 'Cinema Keiba' });

    await interaction.reply({ embeds: [embed], files: [imageFile] });
}

async function handleRoulette(interaction, userExists, users, jsonPath, logPath) {
    const bet = interaction.options.getInteger('bet');
    const color = interaction.options.getString('color');

    // Check if the user has enough coins
    if (userExists.coins < bet) return interaction.reply({ content: 'You don\'t have enough coins to place this bet. Use `/work` to earn coins!', ephemeral: true });

    // Place the bet
    userExists.coins -= bet;

    // Roulette odds
    const roulette = Array(18).fill('red').concat(Array(18).fill('black'), 'green');
    const result = roulette[Math.floor(Math.random() * roulette.length)];

    // Determine the outcome of the bet
    let payout = 0;
    if (result === color) payout = color === 'green' ? bet * 35 : bet * 2;

    // Add profit
    if (payout > 0) userExists.coins += payout;

    // Save the updated JSON file and log the registration
    saveUpdatedJSON(interaction, users, jsonPath, logPath, bet, payout);

    // Final result
    const resultText = payout > 0 ? `You have won \`${payout}\` coins!` : `You have lost \`${bet}\` coins...\nBetter luck next time!`;
    const imageFile = new AttachmentBuilder(
        path.resolve(__dirname, './../../assets/economy/casino/Roulette.gif'),
    );
    const embed = new EmbedBuilder()
        .setTitle('Roulette!')
        .setDescription(resultText)
        .addFields(
            { name: 'Choice', value: `${color === 'green' ? '🟢 Green' : color === 'red' ? '🔴 Red' : '⚫ Black'}`, inline: true },
            { name: 'Result', value: `${result === 'green' ? '🟢 Green' : result === 'red' ? '🔴 Red' : '⚫ Black'}`, inline: true },
        )
        .setImage('attachment://Roulette.gif')
        .setTimestamp()
        .setFooter({ text: 'Caligula\'s Casino' });

    await interaction.reply({ embeds: [embed], files: [imageFile] });
}

async function handleScratchcard(interaction, userExists, users, jsonPath, logPath) {
    // Check if the user has enough coins
    if (userExists.coins < 10) return interaction.reply({ content: 'You don\'t have enough coins to play. Use `/work` to earn coins!', ephemeral: true });

    // Discount 10 coins for the scratchcard
    const bet = 10;
    userExists.coins -= bet;

    // Game mechanics
    const randomMessage = () => Math.random() < 0.4 ? '||:money_with_wings:||' : '||:cloud:||';
    const randomMessageBonus = () => Math.random() < 0.4 ? '||:white_check_mark:||' : '||:negative_squared_cross_mark:||';

    // Generate the scratchcard result
    const scratchResults = Array.from({ length: 16 }, randomMessage);
    const bonusResult = randomMessageBonus();

    // Calculate the profit
    const moneyCount = scratchResults.filter(result => result === '||:money_with_wings:||').length;
    let payout = moneyCount;
    if (bonusResult === '||:white_check_mark:||') payout *= 2;

    // Update user coins
    userExists.coins += payout;

    // Save the updated JSON file and log the registration
    saveUpdatedJSON(interaction, users, jsonPath, logPath, bet, payout);

    // Final result
    const embed = new EmbedBuilder()
        .setColor(0x74B454)
        .setDescription(`${scratchResults[0]} ${scratchResults[1]} ${scratchResults[2]} ${scratchResults[3]} ${scratchResults[4]} ${scratchResults[5]}\n${scratchResults[6]} ${scratchResults[7]} ${scratchResults[8]} ${scratchResults[9]} ${scratchResults[10]} ${scratchResults[11]}`)
        .setTitle('The value of each :money_with_wings: is 1$')
        .addFields(
            { name: 'BONUS!', value: `${scratchResults[12]} ${scratchResults[13]} ${scratchResults[14]} ${scratchResults[15]}`, inline: true },
            { name: 'x2', value: `${bonusResult}`, inline: true },
        );

    await interaction.reply({ embeds: [embed] });
}

async function handleSlotPayout(interaction) {
    const payoutEmbed = new EmbedBuilder().setDescription('Three Bells :bell: 10\nFlush of - - :hearts: 8\nFlush of - - :diamonds: 6\nFlush of - - :spades: 4\nTwo :gear: :gear: and :boom: 2\nTwo :gear: :gear: 1');

    await interaction.reply({ embeds: [payoutEmbed], ephemeral: true });
}

async function handleSlotMachine(interaction, userExists, users, jsonPath, logPath) {
    // Check if the user has enough coins
    if (userExists.coins < 1) return interaction.reply({ content: 'You don\'t have enough coins to play. Use `/work` to earn coins!', ephemeral: true });

    // Deposit 1 coin to pull the lever
    const bet = 1;
    userExists.coins -= bet;

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
        .setFooter({ text: '\u200B' });

    await interaction.reply({ embeds: [embed] });

    // Animation loop
    for (let i = 0; i < 8; i++) {
        randomSlots = getRandomSlots();
        embed.setTitle('SPINNING')
            .setDescription(randomSlots.join(' '))
            .setFooter({ text: '\u200B' });
        await interaction.editReply({ embeds: [embed] });
        // Wait 200ms for animation effect
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Determine payout based on the final result
    if ((finalSlot1 === ':gear:' && finalSlot2 === ':gear:' && finalSlot3 !== ':gear:' && finalSlot3 !== ':boom:') ||
        (finalSlot1 === ':gear:' && finalSlot2 !== ':gear:' && finalSlot2 !== ':boom:' && finalSlot3 === ':gear:') ||
        (finalSlot1 !== ':gear:' && finalSlot1 !== ':boom:' && finalSlot2 === ':gear:' && finalSlot3 === ':gear:')) { payout = 1; }
    else if ((finalSlot1 === ':gear:' && finalSlot2 === ':gear:' && finalSlot3 === ':boom:') ||
        (finalSlot1 === ':gear:' && finalSlot2 === ':boom:' && finalSlot3 === ':gear:') ||
        (finalSlot1 === ':boom:' && finalSlot2 === ':gear:' && finalSlot3 === ':gear:')) { payout = 2; }
    else if (finalSlot1 === ':spades:' && finalSlot2 === ':spades:' && finalSlot3 === ':spades:') { payout = 4; }
    else if (finalSlot1 === ':diamonds:' && finalSlot2 === ':diamonds:' && finalSlot3 === ':diamonds:') { payout = 6; }
    else if (finalSlot1 === ':hearts:' && finalSlot2 === ':hearts:' && finalSlot3 === ':hearts:') { payout = 8; }
    else if (finalSlot1 === ':bell:' && finalSlot2 === ':bell:' && finalSlot3 === ':bell:') { payout = 10; }

    if (payout > 0) {
        userExists.coins += payout;
        title = 'YOU WIN!';
        if (payout === 1) footerText = `Pay of ${payout} coin!`;
        else footerText = `Pay of ${payout} coins!`;
    }

    // Save the updated JSON file and log the registration
    saveUpdatedJSON(interaction, users, jsonPath, logPath, bet, payout);

    // Final result
    embed.setTitle(title)
        .setDescription(finalResult.join(' '))
        .setFooter({ text: footerText });

    await interaction.editReply({ embeds: [embed] });
}
