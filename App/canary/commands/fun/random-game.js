const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const path = require('path');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('random-game')
        .setDescription('Replies with a random game to play!')
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = './../../database/games/icons.json';
        const data = require(jsonPath);

        const randomGame = Math.floor(Math.random() * data.length);

        const imageFile = new AttachmentBuilder(
            path.resolve(__dirname, `./../../assets/games/list/${data[randomGame]}`),
        );
        const embed = new EmbedBuilder().setImage(`attachment://${data[randomGame]}`);

        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};
