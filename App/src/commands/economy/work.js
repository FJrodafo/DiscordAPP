const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'economy',
    cooldown: 86_400,
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn daily coins!'),
    async execute(interaction) {
        const jsonPath = './../../database/data.json';
        const user = interaction.user;
        const member = interaction.member;

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

        // Update user coins
        userExists.coins += 40;

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

        // Embed color based on user role
        let embedColor = 'Default';
        const pirate = '1205938469797625947';
        if (member.roles.cache.has(pirate)) embedColor = 0x71368A;
        const captain = '1259986911460851783';
        if (member.roles.cache.has(captain)) embedColor = 0x9B59B6;
        const serverBooster = '1207653983850594335';
        if (member.roles.cache.has(serverBooster)) embedColor = 0xF47FFF;
        const treasurerOfTheNight = '1205938707442434118';
        if (member.roles.cache.has(treasurerOfTheNight)) embedColor = 0x010000;
        const serverOwner = '1205588374354796574';
        if (member.roles.cache.has(serverOwner)) embedColor = 0xF1C40F;

        // Result
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription('You have earned `40` coins!');
        return interaction.reply({ embeds: [embed] });
    },
};
