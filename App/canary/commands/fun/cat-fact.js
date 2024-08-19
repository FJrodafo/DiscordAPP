const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('cat-fact')
        .setDescription('Get a random fact!')
        .setDMPermission(false),
    async execute(interaction) {
        const catResult = await request('https://catfact.ninja/fact');
        const { fact } = await catResult.body.json();

        await interaction.reply({ content: fact });
    },
};
