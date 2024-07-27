const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('string-select-menu')
        .setDescription('Example of a string selection menu!'),
    async execute(interaction) {
        const starters = [
            {
                label: 'Bulbasaur',
                description: 'The dual-type Grass/Poison Seed Pokémon.',
                value: 'bulbasaur',
                emoji: '🌿',
            },
            {
                label: 'Charmander',
                description: 'The Fire-type Lizard Pokémon.',
                value: 'charmander',
                emoji: '🔥',
            },
            {
                label: 'Squirtle',
                description: 'The Water-type Tiny Turtle Pokémon.',
                value: 'squirtle',
                emoji: '🫧',
            },
        ];

        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            .setMinValues(0)
            .setMaxValues(starters.length)
            .addOptions(
                starters.map((starter) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(starter.label)
                        .setDescription(starter.description)
                        .setValue(starter.value)
                        .setEmoji(starter.emoji),
                ),
            );

        const actionRow = new ActionRowBuilder()
            .addComponents(select);

        const reply = await interaction.reply({
            content: 'Choose your starter!',
            components: [actionRow],
            ephemeral: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
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
