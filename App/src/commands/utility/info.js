const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about the server or the user!')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Display info about this server!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Provides information about the user!'),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const jsonPath = './../../database/data.json';
        const guild = interaction.guild;
        const user = interaction.user;
        const member = interaction.member;
        let embed;

        if (subcommand === 'server') {
            embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setThumbnail(`${guild.iconURL()}`)
                .addFields(
                    { name: 'Server Name:', value: `${guild.name}`, inline: true },
                    { name: 'ID:', value: `${guild.id}`, inline: true },
                    { name: 'Total members:', value: `${guild.memberCount}`, inline: true },
                    { name: 'Created at:', value: `${guild.createdAt}`, inline: false },
                );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else if (subcommand === 'user') {
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
            embed = new EmbedBuilder()
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
        }
    },
};
