const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('User')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = './../../database/data.json';
        const user = interaction.targetUser;
        const member = interaction.targetMember;

        // Read JSON file
        let users = [];
        try {
            const data = fs.readFileSync(jsonPath, 'utf8');
            users = JSON.parse(data);
        }
        catch (err) {
            console.error('Error reading data.json:', err);
        }

        // Check if the user is already registered
        const userId = user.id.toString();
        let userExists = users.find(u => u.user === userId);

        // If the user is not registered, add it
        if (!userExists) {
            const newUser = {
                // Assign a new ID
                id: users.length + 1,
                user: userId,
                karma: 0,
                coins: 0,
            };
            users.push(newUser);

            // Save the updated JSON file
            try {
                fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2), 'utf8');
                console.log('User added to data.json');
            }
            catch (err) {
                console.error('Error writing to data.json:', err);
            }
            // Now userExists is the new user added
            userExists = newUser;
        }

        // Create the embed with the user information
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setThumbnail(`${user.displayAvatarURL()}`)
            .addFields(
                { name: 'User:', value: `${user}`, inline: true },
                { name: 'Karma:', value: `:performing_arts: ${userExists.karma}`, inline: true },
                { name: 'Coins:', value: `:coin: ${userExists.coins}`, inline: true },
                { name: 'ID:', value: `${user.id}`, inline: true },
                { name: 'Joined at:', value: `${member.joinedAt}`, inline: true },
            );
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
