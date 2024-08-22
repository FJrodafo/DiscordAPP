const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs');
process.chdir(__dirname);

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
        const jsonPath = './../../database/data.json';
        const logPath = './../../database/log.txt';

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

        // Save the updated JSON file
        try {
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            const now = new Date();
            const timestamp = now.toLocaleString();
            const logMessage = `\n${timestamp} - ${interaction.user.id} stole ${stealAmount} coins from ${targetUser.id}\n`;
            fs.appendFileSync(logPath, logMessage, 'utf8');
            console.log(logMessage);
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
            imageFile = new AttachmentBuilder('./../../assets/economy/Raid.gif');
            embed = new EmbedBuilder()
                .setTitle('Steal Attempt!')
                .setDescription(`The FBI caught you stealing coins from ${targetUser}`)
                .setImage('attachment://Raid.gif')
                .setTimestamp()
                .setFooter({ text: 'Karma -1' });

            return interaction.reply({ embeds: [embed], files: [imageFile] });
        }
        else {
            imageFile = new AttachmentBuilder('./../../assets/economy/Steal.gif');
            embed = new EmbedBuilder()
                .setTitle('Steal Attempt!')
                .setDescription(`You successfully stole \`${stealAmount}\` coins from ${targetUser}`)
                .setImage('attachment://Steal.gif')
                .setTimestamp()
                .setFooter({ text: 'Karma -1' });

            return interaction.reply({ embeds: [embed], files: [imageFile] });
        }
    },
};

// Function to determine steal amount based on target user's coins
function determineStealAmount(targetCoins) {
    const random = Math.random() * 100;
    /*
    If targetUser is equal to or greater than 1000 coins:
        10% chance of stealing 500 coins
        10% chance of stealing 200 coins
        10% chance of stealing 100 coins
        10% chance of stealing 50 coins
        10% chance of stealing 20 coins
        10% chance of stealing 10 coins
        20% chance of stealing 5 coins
        20% chance of not getting anything
    If targetUser is equal to or greater than 400 coins:
        10% chance of stealing 200 coins
        10% chance of stealing 100 coins
        10% chance of stealing 20 coins
        10% chance of stealing 10 coins
        30% chance of stealing 5 coins
        30% chance of not getting anything
    If targetUser is equal to or greater than 200 coins:
        10% chance of stealing 100 coins
        10% chance of stealing 10 coins
        40% chance of stealing 5 coins
        40% chance of not getting anything
    If targetUser is equal to or greater than 100 coins:
        20% chance of stealing 50 coins
        20% chance of stealing 5 coins
        60% chance of not getting anything
    If targetUser is equal to or greater than 40 coins:
        20% chance of stealing 20 coins
        20% chance of stealing 5 coins
        60% chance of not getting anything
    If targetUser is equal to or greater than 20 coins:
        20% chance of stealing 10 coins
        20% chance of stealing 5 coins
        60% chance of not getting anything
    If targetUser is equal to or greater than 10 coins:
        40% chance of stealing 5 coins
        60% chance of not getting anything
    If targetUser has less than 10 coins:
        100% chance of not getting anything
    */
    if (targetCoins >= 1000) {
        if (random < 10) return 500;
        if (random < 20) return 200;
        if (random < 30) return 100;
        if (random < 40) return 50;
        if (random < 50) return 20;
        if (random < 60) return 10;
        if (random < 80) return 5;
        return 0;
    }
    else if (targetCoins >= 400) {
        if (random < 10) return 200;
        if (random < 20) return 100;
        if (random < 30) return 20;
        if (random < 40) return 10;
        if (random < 70) return 5;
        return 0;
    }
    else if (targetCoins >= 200) {
        if (random < 10) return 100;
        if (random < 20) return 10;
        if (random < 60) return 5;
        return 0;
    }
    else if (targetCoins >= 100) {
        if (random < 20) return 50;
        if (random < 40) return 5;
        return 0;
    }
    else if (targetCoins >= 40) {
        if (random < 20) return 20;
        if (random < 40) return 5;
        return 0;
    }
    else if (targetCoins >= 20) {
        if (random < 20) return 10;
        if (random < 40) return 5;
        return 0;
    }
    else if (targetCoins >= 10) {
        if (random < 40) return 5;
        return 0;
    }
    else {
        return 0;
    }
}
