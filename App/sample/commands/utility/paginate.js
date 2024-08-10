const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('paginate')
        .setDescription('Navigate through pages using buttons!')
        .addSubcommand(subcommand => subcommand
            .setName('two-pages')
            .setDescription('Example of pagination with two pages!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('multiple-pages')
            .setDescription('Example of pagination with multiple pages!'),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'two-pages') {
            // Create the two embeds for the two pages
            const page1 = new EmbedBuilder()
                .setTitle('Page 1')
                .setDescription('This is the first page.')
                .setColor(0x0099ff);

            const page2 = new EmbedBuilder()
                .setTitle('Page 2')
                .setDescription('This is the second page.')
                .setColor(0xff9900);

            // Create the two buttons
            const backButton = new ButtonBuilder()
                .setCustomId('back-button')
                .setLabel('←')
                .setStyle(ButtonStyle.Primary)
                // Initially disabled because you are on the first page
                .setDisabled(true);

            const nextButton = new ButtonBuilder()
                .setCustomId('next-button')
                .setLabel('→')
                .setStyle(ButtonStyle.Primary);

            const buttonRow = new ActionRowBuilder().addComponents(backButton, nextButton);

            // Reply with the first page and buttons
            const reply = await interaction.reply({
                embeds: [page1],
                components: [buttonRow],
                // Make it visible only to the user
                ephemeral: true,
            });

            // Create an event collector for the buttons
            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (i) => i.user.id === interaction.user.id,
                // 60 seconds
                time: 60_000,
            });

            // Handle button interaction
            collector.on('collect', async (i) => {
                if (i.customId === 'next-button') {
                    // If the user presses "Next → ", show the second page
                    await i.update({
                        embeds: [page2],
                        components: [
                            new ActionRowBuilder().addComponents(
                                backButton.setDisabled(false),
                                nextButton.setDisabled(true),
                            ),
                        ],
                    });
                }
                else if (i.customId === 'back-button') {
                    // If the user presses "Back ← ", return to the first page
                    await i.update({
                        embeds: [page1],
                        components: [
                            new ActionRowBuilder().addComponents(
                                backButton.setDisabled(true),
                                nextButton.setDisabled(false),
                            ),
                        ],
                    });
                }
            });

            collector.on('end', async () => {
                // Disable buttons when time is up
                backButton.setDisabled(true);
                nextButton.setDisabled(true);
                reply.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
                            backButton,
                            nextButton,
                        ),
                    ],
                });
            });
        }
        else if (subcommand === 'multiple-pages') {
            // Define the embeds for each page
            const pages = [
                new EmbedBuilder()
                    .setTitle('Page 1')
                    .setDescription('This is the first page.')
                    .setColor(0x0099ff),

                new EmbedBuilder()
                    .setTitle('Page 2')
                    .setDescription('This is the second page.')
                    .setColor(0xff9900),

                new EmbedBuilder()
                    .setTitle('Page 3')
                    .setDescription('This is the third page.')
                    .setColor(0x99ff00),

                new EmbedBuilder()
                    .setTitle('Page 4')
                    .setDescription('This is the fourth page.')
                    .setColor(0x9900ff),
            ];

            // Initialize the page index
            let currentPage = 0;

            // Create the two buttons
            const backButton = new ButtonBuilder()
                .setCustomId('back-button')
                .setLabel('←')
                .setStyle(ButtonStyle.Primary)
                // Initially disabled because you are on the first page
                .setDisabled(true);

            const nextButton = new ButtonBuilder()
                .setCustomId('next-button')
                .setLabel('→')
                .setStyle(ButtonStyle.Primary)
                // Disabled if there's only one page
                .setDisabled(pages.length === 1);

            const buttonRow = new ActionRowBuilder().addComponents(backButton, nextButton);

            // Reply with the first page and buttons
            const reply = await interaction.reply({
                embeds: [pages[currentPage]],
                components: [buttonRow],
                // Make it visible only to the user
                ephemeral: true,
            });

            // Create an event collector for the buttons
            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (i) => i.user.id === interaction.user.id,
                // 60 seconds
                time: 60_000,
            });

            // Handle button interaction
            collector.on('collect', async (i) => {
                // Handle button presses
                if (i.customId === 'back-button') currentPage--;
                else if (i.customId === 'next-button') currentPage++;

                // Update button states based on the current page
                backButton.setDisabled(currentPage === 0);
                nextButton.setDisabled(currentPage === pages.length - 1);

                // Update the embed and buttons
                await i.update({
                    embeds: [pages[currentPage]],
                    components: [buttonRow],
                });
            });

            collector.on('end', async () => {
                // Disable buttons when collector ends
                backButton.setDisabled(true);
                nextButton.setDisabled(true);

                await interaction.editReply({
                    components: [buttonRow],
                });
            });
        }
    },
};
