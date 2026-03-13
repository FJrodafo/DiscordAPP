const {
    SlashCommandBuilder,
    PermissionFlagsBits,
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

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'I do not have permission to prune messages in this channel.', ephemeral: true });
        }

        if (amount < 1 || amount > 99) {
            return interaction.reply({ content: 'You need to input a number between `1` and `99`', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to prune messages in this channel.', ephemeral: true });
        });

        return interaction.reply({ content: `Successfully pruned \`${amount}\` messages!`, ephemeral: true });
    },
};
