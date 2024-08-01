const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        const guild = interaction.guild;
        const user = interaction.user;
        const member = interaction.member;
        let embed;

        if (subcommand === 'server') {
            embed = new EmbedBuilder()
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
            embed = new EmbedBuilder()
                .setThumbnail(`${user.displayAvatarURL()}`)
                .addFields(
                    { name: 'User:', value: `${user.username}`, inline: true },
                    { name: 'ID:', value: `${user.id}`, inline: true },
                    { name: 'Joined at:', value: `${member.joinedAt}`, inline: false },
                );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
