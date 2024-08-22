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
        .setName('give')
        .setDescription('Give coins to another user!')
        .setDMPermission(false)
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount of coins to give!')
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
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to give coins to!')
            .setRequired(true),
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
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

        // Check if the user has enough coins
        if (userExists.coins < amount) return interaction.reply({ content: 'You don\'t have enough coins to complete this transaction. Use `/work` to earn coins!', ephemeral: true });

        // Prevent users from sending coins to themselves
        if (targetUser.id === interaction.user.id) return interaction.reply({ content: 'You cannot give coins to yourself!', ephemeral: true });

        // Give coins
        userExists.coins -= amount;
        targetUserExists.coins += amount;

        // Update karma
        if (userExists.karma < 10) userExists.karma += 1;

        // Save the updated JSON file
        try {
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            const now = new Date();
            const timestamp = now.toLocaleString();
            const logMessage = `\n${timestamp} - ${interaction.user.id} successfully gave ${amount} coins to ${targetUser.id}\n`;
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
        const imageFile = new AttachmentBuilder('./../../assets/economy/Give.gif');
        const embed = new EmbedBuilder()
            .setTitle('You decided to give some coins!')
            .setDescription(`You have given \`${amount}\` coins to ${targetUser}\n`)
            .setImage('attachment://Give.gif')
            .setTimestamp()
            .setFooter({ text: 'Karma +1' });

        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};
