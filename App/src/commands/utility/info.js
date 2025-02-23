const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

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
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.options.getMember('target') || interaction.member;

    const embed = new EmbedBuilder()
        .setThumbnail(`${user.displayAvatarURL()}`)
        .addFields(
            { name: 'User:', value: `${user.username}`, inline: true },
            { name: 'ID:', value: `${user.id}`, inline: true },
            { name: 'Joined at:', value: `${member.joinedAt}`, inline: false },
        );

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
