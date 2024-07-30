const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clover')
        .setDescription('Find a clover!'),
    async execute(interaction) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const randomClover = (randomNumber === 0) ? ':four_leaf_clover:' : ':shamrock:';
        await interaction.reply({ content: `${interaction.user} found a ${randomClover}` });
    },
};
