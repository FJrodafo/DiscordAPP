const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');
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
            .setDescription('Provides information about the user!')
            .addUserOption(option => option
                .setName('target')
                .setDescription('Choose a user!')
                .setRequired(false),
            ),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'server') return handleServerInfo(interaction);
        else if (subcommand === 'user') return handleUserInfo(interaction);
    },
};

async function handleServerInfo(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
        .setThumbnail(`${guild.iconURL()}`)
        .addFields(
            { name: 'Server Name:', value: `${guild.name}`, inline: true },
            { name: 'ID:', value: `${guild.id}`, inline: true },
            { name: 'Total members:', value: `${guild.memberCount}`, inline: true },
            { name: 'Created at:', value: `${guild.createdAt}`, inline: false },
        );
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleUserInfo(interaction) {
    const jsonPath = './../../database/data.json';
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.options.getMember('target') || interaction.member;

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

    // Embed color based on user role
    const embedColor = getEmbedColor(member);

    // Create the embed with the user information
    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setThumbnail(`${user.displayAvatarURL()}`)
        .addFields(
            { name: 'User:', value: `${user}`, inline: true },
            { name: 'Karma:', value: `:performing_arts: ${userExists.karma}`, inline: true },
            { name: 'Coins:', value: `:coin: ${userExists.coins}`, inline: true },
            { name: 'ID:', value: `${user.id}`, inline: true },
            { name: 'Joined at:', value: `${member.joinedAt}`, inline: true },
        );
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

function getEmbedColor(member) {
    const ROLES = {
        pirate: '1205938469797625947',
        captain: '1259986911460851783',
        serverBooster: '1207653983850594335',
        treasurerOfTheNight: '1205938707442434118',
        serverOwner: '1205588374354796574',
    };

    const ROLE_COLORS = {
        [ROLES.pirate]: 0x71368A,
        [ROLES.captain]: 0x9B59B6,
        [ROLES.serverBooster]: 0xF47FFF,
        [ROLES.treasurerOfTheNight]: 0x010000,
        [ROLES.serverOwner]: 0xF1C40F,
    };

    for (const [role, color] of Object.entries(ROLE_COLORS)) {
        if (member.roles.cache.has(role)) return color;
    }

    return 'Default';
}
