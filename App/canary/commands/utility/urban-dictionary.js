const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require('discord.js');
const path = require('path');
const { request } = require('undici');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('urban-dictionary')
        .setDescription('Crowdsourced online dictionary of slang terms!')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('term')
            .setDescription('The term you want to search for!')
            .setRequired(false),
        ),
    async execute(interaction) {
        const term = interaction.options.getString('term');
        const query = new URLSearchParams({ term });

        const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
        const { list } = await dictResult.body.json();

        if (!list.length) return interaction.reply({ content: `No results found for **${term}**.`, ephemeral: true });

        const [answer] = list;

        const image = new AttachmentBuilder(
            path.resolve(__dirname, './../../assets/urban-dictionary/logo.png'),
        );

        const embed = new EmbedBuilder()
            .setColor(0xEFFF00)
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addFields(
                { name: 'Definition', value: answer.definition.substr(0, 1024) },
                { name: 'Example', value: answer.example.substr(0, 1024) },
                { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
            )
            .setImage('attachment://logo.png');

        await interaction.reply({
            embeds: [embed],
            files: [image],
        });
    },
};
