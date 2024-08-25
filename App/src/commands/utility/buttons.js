const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');
const emoji = require('./../../utils/emoji.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('buttons')
        .setDescription('Press the buttons!')
        .setDMPermission(false),
    async execute(interaction) {
        const primaryButton = new ButtonBuilder()
            .setCustomId('primary-button')
            .setLabel('Primary button')
            .setStyle(ButtonStyle.Primary);

        const secondaryButton = new ButtonBuilder()
            .setCustomId('secondary-button')
            .setLabel('Secondary button')
            .setStyle(ButtonStyle.Secondary);

        const successButton = new ButtonBuilder()
            .setCustomId('success-button')
            .setEmoji(emoji.white_check_mark)
            .setLabel('Success button')
            .setStyle(ButtonStyle.Success);

        const dangerButton = new ButtonBuilder()
            .setCustomId('danger-button')
            .setEmoji(emoji.warning)
            .setLabel('Danger button')
            .setStyle(ButtonStyle.Danger);

        const linkButton = new ButtonBuilder()
            .setURL('https://github.com/FJrodafo/DiscordAPP')
            .setLabel('Link button')
            .setStyle(ButtonStyle.Link);

        const buttonRow = new ActionRowBuilder().addComponents(
            primaryButton,
            secondaryButton,
            successButton,
            dangerButton,
            linkButton,
        );

        const reply = await interaction.reply({
            content: 'Press the buttons!',
            components: [buttonRow],
            ephemeral: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'primary-button') i.reply({ content: 'You clicked on the primary button!', ephemeral: true });
            if (i.customId === 'secondary-button') i.reply({ content: 'You clicked on the secondary button!', ephemeral: true });
            if (i.customId === 'success-button') i.reply({ content: 'You clicked on the success button!', ephemeral: true });
            if (i.customId === 'danger-button') i.reply({ content: 'You clicked on the danger button!', ephemeral: true });
        });

        collector.on('end', async () => {
            primaryButton.setDisabled(true);
            secondaryButton.setDisabled(true);
            successButton.setDisabled(true);
            dangerButton.setDisabled(true);

            reply.edit({
                content: 'You run out of time! Try again later...',
                components: [buttonRow],
            });
        });
    },
};
