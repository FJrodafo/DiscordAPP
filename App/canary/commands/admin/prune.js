const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'admin',
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Prune up to 99 messages!')
        .setDefaultMemberPermissions(0)
        .setDMPermission(false)
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Number of messages to prune!')
            .setRequired(false),
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        let embed;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            embed = new EmbedBuilder()
                .setColor(0xFF005C)
                .setDescription('🧹 I do not have permission to prune messages in this channel.');

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (amount < 1 || amount > 99) {
            embed = new EmbedBuilder()
                .setColor(0xFF005C)
                .setDescription('🧹 You need to input a number between `1` and `99`');

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            embed = new EmbedBuilder()
                .setColor(0xFF005C)
                .setDescription('🧹 There was an error trying to prune messages in this channel.');

            interaction.reply({ embeds: [embed], ephemeral: true });
        });

        embed = new EmbedBuilder()
            .setColor(0xFF005C)
            .setDescription(`🧹 Successfully pruned \`${amount}\` messages!`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
