const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
} = require('discord.js');
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('paginate')
        .setDescription('Navigate through pages using buttons!')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('two-pages')
            .setDescription('Example of pagination with two pages!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('multiple-pages')
            .setDescription('Example of pagination with multiple pages!'),
        )
        .addSubcommand(subcommand => subcommand
            .setName('too-many-pages')
            .setDescription('Example of pagination with too many pages!'),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'two-pages') {
            const pages = [
                new EmbedBuilder().setTitle('Page 1').setDescription('This is the first page.').setColor(0x5865f2),
                new EmbedBuilder().setTitle('Page 2').setDescription('This is the second page.').setColor(0x5865f2),
            ];

            return handlePagination(interaction, pages);
        }
        else if (subcommand === 'multiple-pages') {
            const pages = [
                new EmbedBuilder().setTitle('Page 1').setDescription('This is the first page.').setColor(0x5865f2),
                new EmbedBuilder().setTitle('Page 2').setDescription('This is the second page.').setColor(0x5865f2),
                new EmbedBuilder().setTitle('Page 3').setDescription('This is the third page.').setColor(0x5865f2),
                new EmbedBuilder().setTitle('Page 4').setDescription('This is the fourth page.').setColor(0x5865f2),
            ];

            return handlePagination(interaction, pages);
        }
        else if (subcommand === 'too-many-pages') {
            const pages = Array.from({ length: 10 }, (_, i) => (
                new EmbedBuilder()
                    .setTitle(`Page ${i + 1}`)
                    .setDescription('This is the content of the page.')
                    .setColor(0x5865f2)
            ));

            return handleAdvancedPagination(interaction, pages);
        }
    },
};

async function handlePagination(interaction, pages) {
    let currentPage = 0;

    const backButton = new ButtonBuilder()
        .setCustomId('back-button')
        .setLabel(emoji.arrow_left)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const nextButton = new ButtonBuilder()
        .setCustomId('next-button')
        .setLabel(emoji.arrow_right)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages.length === 1);

    const buttonRow = new ActionRowBuilder().addComponents(
        backButton,
        nextButton,
    );

    const reply = await interaction.reply({
        embeds: [pages[currentPage]],
        components: [buttonRow],
        ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: 60_000,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'back-button') currentPage--;
        else if (i.customId === 'next-button') currentPage++;

        backButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === pages.length - 1);

        await i.update({
            embeds: [pages[currentPage]],
            components: [buttonRow],
        });
    });

    collector.on('end', async () => {
        backButton.setDisabled(true);
        nextButton.setDisabled(true);

        await interaction.editReply({ components: [buttonRow] });
    });
}

async function handleAdvancedPagination(interaction, pages) {
    let currentPage = 0;

    const firstPageButton = new ButtonBuilder()
        .setCustomId('first-page-button')
        .setLabel(emoji.arrow_up)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const backButton = new ButtonBuilder()
        .setCustomId('back-button')
        .setLabel(emoji.arrow_left)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const nextButton = new ButtonBuilder()
        .setCustomId('next-button')
        .setLabel(emoji.arrow_right)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages.length <= 1);

    const lastPageButton = new ButtonBuilder()
        .setCustomId('last-page-button')
        .setLabel(emoji.arrow_down)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages.length <= 1);

    const buttonRow = new ActionRowBuilder().addComponents(
        firstPageButton,
        backButton,
        nextButton,
        lastPageButton,
    );

    const reply = await interaction.reply({
        embeds: [pages[currentPage]],
        components: [buttonRow],
        ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: 120_000,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'first-page-button') currentPage = 0;
        if (i.customId === 'back-button') currentPage--;
        if (i.customId === 'next-button') currentPage++;
        if (i.customId === 'last-page-button') currentPage = pages.length - 1;

        firstPageButton.setDisabled(currentPage === 0);
        backButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === pages.length - 1);
        lastPageButton.setDisabled(currentPage === pages.length - 1);

        await i.update({
            embeds: [pages[currentPage]],
            components: [buttonRow],
        });
    });

    collector.on('end', async () => {
        firstPageButton.setDisabled(true);
        backButton.setDisabled(true);
        nextButton.setDisabled(true);
        lastPageButton.setDisabled(true);

        await interaction.editReply({
            components: [buttonRow],
        });
    });
}
