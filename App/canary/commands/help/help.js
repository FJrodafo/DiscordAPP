const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'help',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands!')
        .setDMPermission(false),
    async execute(interaction) {
        // Function to recursively read commands from directories
        function getCommands(dir) {
            const commandFiles = [];
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    if (file !== 'admin' && file !== 'moderation' && file !== 'context-menu' && file !== 'help') {
                        commandFiles.push(...getCommands(filePath));
                    }
                    if (file === 'admin' && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                        commandFiles.push(...getCommands(filePath));
                    }
                    if (file === 'moderation' && interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                        commandFiles.push(...getCommands(filePath));
                    }
                }
                else if (file.endsWith('.js')) {
                    commandFiles.push(filePath);
                }
            }

            return commandFiles;
        }

        const commandsDir = path.join(__dirname, './../../commands');
        const commandFiles = getCommands(commandsDir);

        const commands = commandFiles.map(file => {
            const command = require(file);
            // Get the category (folder name)
            const category = path.basename(path.dirname(file));

            return {
                name: `${command.data.name} (${category})`,
                description: command.data.description || 'No description',
            };
        });

        // Divide commands into pages of 5 commands each
        const commandsPerPage = 5;
        const totalPages = Math.ceil(commands.length / commandsPerPage);

        const pages = [];
        for (let i = 0; i < commands.length; i += commandsPerPage) {
            const page = new EmbedBuilder()
                .setColor(0x5865f2)
                .setTitle('All available commands:')
                .setDescription('You have one minute to turn the page until the buttons are disabled...')
                .setFooter({ text: `Page ${Math.floor(i / commandsPerPage) + 1} of ${totalPages}` });

            for (let j = i; j < i + commandsPerPage && j < commands.length; j++) {
                page.addFields({ name: '/' + commands[j].name, value: commands[j].description });
            }

            pages.push(page);
        }

        let currentPage = 0;

        // Create the pagination buttons
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
            .setDisabled(totalPages === 1);

        const lastPageButton = new ButtonBuilder()
            .setCustomId('last-page-button')
            .setLabel(emoji.arrow_down)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(totalPages === 1);

        const buttonRow = new ActionRowBuilder().addComponents(firstPageButton, backButton, nextButton, lastPageButton);

        // Send the initial embed with buttons
        const reply = await interaction.reply({
            embeds: [pages[currentPage]],
            components: [buttonRow],
            ephemeral: true,
        });

        // Create an event collector for the buttons
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === interaction.user.id,
            time: 120_000,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'first-page-button') currentPage = 0;
            if (i.customId === 'back-button') currentPage--;
            if (i.customId === 'next-button') currentPage++;
            if (i.customId === 'last-page-button') currentPage = totalPages - 1;

            // Update button states based on the current page
            firstPageButton.setDisabled(currentPage === 0);
            backButton.setDisabled(currentPage === 0);
            nextButton.setDisabled(currentPage === totalPages - 1);
            lastPageButton.setDisabled(currentPage === totalPages - 1);

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
    },
};
