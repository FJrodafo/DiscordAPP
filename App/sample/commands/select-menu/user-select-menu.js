const { SlashCommandBuilder, UserSelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    category: 'select-menu',
    data: new SlashCommandBuilder()
        .setName('user-select-menu')
        .setDescription('Example of a user selection menu!'),
    async execute(interaction) {
        const userMenu = new UserSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setMinValues(0)
            .setMaxValues(1);

        const actionRow = new ActionRowBuilder()
            .setComponents(userMenu);

        const reply = await interaction.reply({
            components: [actionRow],
            ephemeral: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.UserSelect,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            const selectedValues = i.values;

            if (!selectedValues.length) {
                await interaction.followUp({ content: 'You have emptied your selection.', ephemeral: true });
            }
            else {
                await interaction.followUp({ content: `You have now selected: ${selectedValues.join(', ')}`, ephemeral: true });
            }
        });
    },
};
