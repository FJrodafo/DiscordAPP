const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    category: 'economy',
    cooldown: 28_800,
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('Attempt to steal coins from another user!')
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to steal coins from!')
            .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
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
        if (!userExists) return interaction.reply({ content: 'To register use: `/register`', ephemeral: true });

        // Check if the target user is already registered
        const targetUserId = targetUser.id.toString();
        const targetUserExists = users.find(u => u.user === targetUserId);
        if (!targetUserExists) return interaction.reply({ content: 'The target user is not registered yet.', ephemeral: true });

        // Prevent users from stealing from themselves
        if (targetUser.id === interaction.user.id) return interaction.reply({ content: 'You cannot steal coins from yourself!', ephemeral: true });

        // Determine the possible steal amount based on the target user's coins
        const stealAmount = determineStealAmount(targetUserExists.coins);

        // Perform the steal
        targetUserExists.coins -= stealAmount;
        userExists.coins += stealAmount;

        // Update karma
        if (userExists.karma > -10) userExists.karma -= 1;

        // Save the updated JSON file and log the transaction asynchronously
        try {
            await fs.writeFile(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            const date = new Date(), timestamp = date.toLocaleString();
            const logMessage = `${timestamp} - ${interaction.user.id} stole ${stealAmount} coins from ${targetUser.id}\n`;
            await fs.appendFile(logPath, logMessage, 'utf8');
        }
        catch (err) {
            console.error('Error writing to data.json/log.txt:', err);
            return interaction.reply({
                content: 'There was an error updating the database.',
                ephemeral: true,
            });
        }

        // Final result
        let imageFile, embed;

        if (stealAmount === 0) {
            imageFile = new AttachmentBuilder(
                path.resolve(__dirname, './../../assets/economy/Raid.gif'),
            );
            embed = new EmbedBuilder()
                .setTitle('Steal Attempt!')
                .setDescription(`The FBI caught you stealing coins from ${targetUser}`)
                .setImage('attachment://Raid.gif')
                .setTimestamp()
                .setFooter({ text: 'Karma -1' });
        }
        else {
            imageFile = new AttachmentBuilder(
                path.resolve(__dirname, './../../assets/economy/Steal.gif'),
            );
            embed = new EmbedBuilder()
                .setTitle('Steal Attempt!')
                .setDescription(`You successfully stole \`${stealAmount}\` coins from ${targetUser}`)
                .setImage('attachment://Steal.gif')
                .setTimestamp()
                .setFooter({ text: 'Karma -1' });
        }

        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};

// Function to determine steal amount based on target user's coins
function determineStealAmount(targetCoins) {
    // Random number between 0 and 100
    const random = Math.floor(Math.random() * 101);

    // Define steal scenarios based on coin range
    const stealRanges = [
        {
            userCoins: 10000, ranges: [
                { chance: 10, amount: 500 },
                { chance: 10, amount: 200 },
                { chance: 10, amount: 100 },
                { chance: 10, amount: 50 },
                { chance: 10, amount: 20 },
                { chance: 10, amount: 10 },
                { chance: 10, amount: 5 },
                { chance: 30, amount: 0 },
            ],
        },
        {
            userCoins: 1000, ranges: [
                { chance: 5, amount: 500 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 400, ranges: [
                { chance: 5, amount: 200 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 200, ranges: [
                { chance: 5, amount: 100 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 100, ranges: [
                { chance: 5, amount: 50 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 40, ranges: [
                { chance: 5, amount: 20 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 20, ranges: [
                { chance: 5, amount: 10 },
                { chance: 15, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 10, ranges: [
                { chance: 20, amount: 5 },
                { chance: 80, amount: 0 },
            ],
        },
        {
            userCoins: 0, ranges: [
                { chance: 100, amount: 0 },
            ],
        },
    ];

    // Iterate through each range to determine the steal amount
    for (const range of stealRanges) {
        if (targetCoins >= range.userCoins) {
            let accumulatedChance = 0;
            for (const { chance, amount } of range.ranges) {
                accumulatedChance += chance;
                if (random < accumulatedChance) {
                    return amount;
                }
            }
        }
    }

    // Default to 0 if no range matched
    return 0;
}
