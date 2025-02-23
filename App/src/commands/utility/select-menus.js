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
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('select-menus')
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
                emoji: emoji.herb,
            },
            {
                label: 'Charmander',
                description: 'The Fire-type Lizard Pokémon.',
                value: 'charmander',
                emoji: emoji.fire,
            },
            {
                label: 'Squirtle',
                description: 'The Water-type Tiny Turtle Pokémon.',
                value: 'squirtle',
                emoji: emoji.bubbles,
            },
        ];

        if (subcommand === 'channel') {
            const channelMenu = new ChannelSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1)
                .setChannelTypes(ChannelType.GuildText);

            await handleSelection(interaction, channelMenu, ComponentType.ChannelSelect);
        }
        else if (subcommand === 'role') {
            const roleMenu = new RoleSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1);

            await handleSelection(interaction, roleMenu, ComponentType.RoleSelect);
        }
        else if (subcommand === 'string') {
            const stringMenu = new StringSelectMenuBuilder()
                .setCustomId('starter')
                .setPlaceholder('Make a selection!')
                .setMinValues(0)
                .setMaxValues(starters.length)
                .addOptions(
                    starters.map((starter) => new StringSelectMenuOptionBuilder()
                        .setLabel(starter.label)
                        .setDescription(starter.description)
                        .setValue(starter.value)
                        .setEmoji(starter.emoji),
                    ),
                );

            await handleSelection(interaction, stringMenu, ComponentType.StringSelect);
        }
        else if (subcommand === 'user') {
            const userMenu = new UserSelectMenuBuilder()
                .setCustomId(interaction.id)
                .setMinValues(0)
                .setMaxValues(1);

            await handleSelection(interaction, userMenu, ComponentType.UserSelect);
        }
    },
};

async function handleSelection(interaction, menu, componentType) {
    const actionRow = new ActionRowBuilder().addComponents(menu);

    const reply = await interaction.reply({
        components: [actionRow],
        ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
        componentType: componentType,
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
            await interaction.followUp({ content: `You have selected: ${selectedValues.join(', ')}`, ephemeral: true });
        }
    });

    collector.on('end', async () => {
        await interaction.editReply({ content: 'You ran out of time! Try again later...', components: [] });
    });
}
