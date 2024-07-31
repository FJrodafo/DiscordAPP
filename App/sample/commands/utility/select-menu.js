const {
    SlashCommandBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    UserSelectMenuBuilder,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('select-menu')
        .setDescription('Make a selection!')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('channel')
            .setDescription('Example of a channel selection menu!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('role')
            .setDescription('Example of a role selection menu!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('string')
            .setDescription('Example of a string selection menu!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Example of a user selection menu!'),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
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
        // Variables
        let channelMenu, roleMenu, select, userMenu, actionRow, reply, collector, selectedValues;
        // Channel Select Menu
        if (subcommand === 'channel') {
            channelMenu = new ChannelSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1)
                .setChannelTypes(ChannelType.GuildText);

            actionRow = new ActionRowBuilder()
                .setComponents(channelMenu);

            reply = await interaction.reply({
                components: [actionRow],
                ephemeral: true,
            });

            collector = reply.createMessageComponentCollector({
                componentType: ComponentType.ChannelSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000,
            });

            collector.on('collect', async (i) => {
                await i.deferUpdate();
                selectedValues = i.values;

                if (!selectedValues.length) {
                    await interaction.followUp({ content: 'You have emptied your selection.', ephemeral: true });
                }
                else {
                    await interaction.followUp({ content: `You have now selected: ${selectedValues.join(', ')}`, ephemeral: true });
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({ content: 'You run out of time! Try again later...', components: [] });
            });
        }
        // Role Select Menu
        else if (subcommand === 'role') {
            roleMenu = new RoleSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1);

            actionRow = new ActionRowBuilder()
                .setComponents(roleMenu);

            reply = await interaction.reply({
                components: [actionRow],
                ephemeral: true,
            });

            collector = reply.createMessageComponentCollector({
                componentType: ComponentType.RoleSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000,
            });

            collector.on('collect', async (i) => {
                await i.deferUpdate();
                selectedValues = i.values;

                if (!selectedValues.length) {
                    await interaction.followUp({ content: 'You have emptied your selection.', ephemeral: true });
                }
                else {
                    await interaction.followUp({ content: `You have now selected: ${selectedValues.join(', ')}`, ephemeral: true });
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({ content: 'You run out of time! Try again later...', components: [] });
            });
        }
        // String Select Menu
        else if (subcommand === 'string') {
            select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
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
                        ),
                );

            reply = await interaction.reply({
                content: 'Choose your starter!',
                components: [select],
                ephemeral: true,
            });

            collector = reply.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000,
            });

            collector.on('collect', async (i) => {
                await i.deferUpdate();
                selectedValues = i.values;

                if (!selectedValues.length) {
                    await interaction.followUp({ content: 'You have emptied your selection.', ephemeral: true });
                }
                else {
                    await interaction.followUp({ content: `You have now selected: ${selectedValues.join(', ')}`, ephemeral: true });
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({ content: 'You run out of time! Try again later...', components: [] });
            });
        }
        // User Select Menu
        else if (subcommand === 'user') {
            userMenu = new UserSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1);

            actionRow = new ActionRowBuilder()
                .setComponents(userMenu);

            reply = await interaction.reply({
                components: [actionRow],
                ephemeral: true,
            });

            collector = reply.createMessageComponentCollector({
                componentType: ComponentType.UserSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000,
            });

            collector.on('collect', async (i) => {
                await i.deferUpdate();
                selectedValues = i.values;

                if (!selectedValues.length) {
                    await interaction.followUp({ content: 'You have emptied your selection.', ephemeral: true });
                }
                else {
                    await interaction.followUp({ content: `You have now selected: ${selectedValues.join(', ')}`, ephemeral: true });
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({ content: 'You run out of time! Try again later...', components: [] });
            });
        }
    },
};
