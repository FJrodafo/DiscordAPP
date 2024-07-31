const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('random-game')
        .setDescription('Replies with a random game to play!'),
    async execute(interaction) {
        const jsonPath = './../../database/games/icons.json';
        const data = require(jsonPath);
        const randomGame = Math.floor(Math.random() * data.length);
        const imagePath = `./../../assets/games/list/${data[randomGame]}`;
        const imageFile = new AttachmentBuilder(imagePath);
        const embed = new EmbedBuilder().setImage(`attachment://${data[randomGame]}`);
        await interaction.reply({ embeds: [embed], files: [imageFile] });
    },
};
