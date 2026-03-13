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
        .setName('work')
        .setDescription('Work to earn daily coins!')
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

        // If the user is not registered, send a message to register
        if (!userExists) return interaction.reply({ content: 'To register use: `/register`', ephemeral: true });

        // Update user coins
        userExists.coins += (40 + (userExists.karma * 2));

        // Save the updated JSON file and log the transaction asynchronously
        try {
            await fs.writeFile(jsonPath, JSON.stringify(users, null, 2), 'utf8');
            const date = new Date(), timestamp = date.toLocaleString();
            const logMessage = `${timestamp} - ${interaction.user.id} got a payout of ${40 + (userExists.karma * 2)} from work.js\n`;
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
        let description = '';
        if (userExists.karma > 0) description = `You have earned \`40\` coins!\n\nA bonus of \`${userExists.karma * 2}\` coins have been added due to your good karma!`;
        else if (userExists.karma < 0) description = `You have earned \`40\` coins!\n\nYou have been deducted \`${userExists.karma * 2}\` coins due to your bad karma!`;
        else description = 'You have earned `40` coins!';
        const imageFile = new AttachmentBuilder(
            path.resolve(__dirname, './../../assets/economy/Work.gif'),
        );
        const embed = new EmbedBuilder()
            .setTitle('After a long day at work!')
            .setDescription(description)
            .setImage('attachment://Work.gif')
            .setTimestamp()
            .setFooter({ text: 'Discord Inc.' });

        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};
