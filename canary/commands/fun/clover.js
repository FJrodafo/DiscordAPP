const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'fun',
    cooldown: 86_400,
    data: new SlashCommandBuilder()
        .setName('clover')
        .setDescription('Find a clover!')
        .setDMPermission(false),
    async execute(interaction) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const randomClover = (randomNumber === 0) ? ':four_leaf_clover:' : ':shamrock:';
        const embed = new EmbedBuilder().setDescription(`You found a ${randomClover}`);
        await interaction.reply({ embeds: [embed] });
    },
};
