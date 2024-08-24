const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
    ButtonBuilder, ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');
const path = require('path');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('fml')
        .setDescription('Your everyday life stories!')
        .setDMPermission(false),
    async execute(interaction) {
        const thumbnail = new AttachmentBuilder(
            path.resolve(__dirname, './../../assets/fml/logo.png'),
        );
        const image = new AttachmentBuilder(
            path.resolve(__dirname, './../../assets/fml/baseline.png'),
        );

        const embed = new EmbedBuilder()
            .setColor(0xFC8CB4)
            .setThumbnail('attachment://logo.png')
            .setImage('attachment://baseline.png');

        const button = new ButtonBuilder()
            .setURL('https://www.fmylife.com/')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link);

        const actionRow = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            files: [thumbnail, image],
            ephemeral: true,
        });
    },
};
