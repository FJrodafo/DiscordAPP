const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('paginate')
        .setDescription('Navigate through pages using buttons!'),
    async execute(interaction) {
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
    },
};
