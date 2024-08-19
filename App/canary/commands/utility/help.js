const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'utility',
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
                    if (file !== 'admin' && file !== 'moderation' && file !== 'context-menu') {
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
            const { options } = command.data;
            const subcommands = [];
            const commandOptions = [];

            // Iterate through options to identify subcommands and other options
            options.forEach(option => {
                // Subcommand
                if (option.type === 1) {
                    subcommands.push(option.name);
                }
                // Subcommand Group
                else if (option.type === 2) {
                    subcommands.push(...option.options.map(sub => sub.name));
                }
                // Regular option
                else {
                    commandOptions.push(option.name);
                }
            });

            // Prepare suffixes for subcommands and options
            let suffix = '';
            if (subcommands.length > 0) {
                suffix += `(${subcommands.join(', ')})`;
            }
            else if (commandOptions.length > 0) {
                suffix += ` [${commandOptions.join(', ')}]`;
            }

            return {
                name: `${command.data.name}${suffix}`,
                description: command.data.description || 'No description',
            };
        });

        // Divide commands into pages of 5 commands each
        const commandsPerPage = 5;
        const totalPages = Math.ceil(commands.length / commandsPerPage);

        const pages = [];
        for (let i = 0; i < commands.length; i += commandsPerPage) {
            const page = new EmbedBuilder()
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
            .setLabel('↑')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const backButton = new ButtonBuilder()
            .setCustomId('back-button')
            .setLabel('←')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const nextButton = new ButtonBuilder()
            .setCustomId('next-button')
            .setLabel('→')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(totalPages === 1);

        const lastPageButton = new ButtonBuilder()
            .setCustomId('last-page-button')
            .setLabel('↓')
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
            time: 60_000,
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
