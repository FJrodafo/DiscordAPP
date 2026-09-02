const {
    SlashCommandBuilder,
    AttachmentBuilder,
} = require('discord.js');
const path = require('path');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('random-movie')
        .setDescription('Replies with a random movie to watch!')
        .setDMPermission(false),
    async execute(interaction) {
        const jsonPath = './../../database/movies-series/icons.json';
        const data = require(jsonPath);

        const randomMovie = Math.floor(Math.random() * data.length);

        const imageFile = new AttachmentBuilder(
            path.resolve(__dirname, `./../../assets/movies-series/list/${data[randomMovie]}`),
        );

        await interaction.reply({ files: [imageFile] });
    },
};
