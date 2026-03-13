const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Get your 8ball answer!')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('question')
            .setDescription('Type your question')
            .setRequired(true),
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const msg = [
            'It is certain.', 'It is decidely so.', 'Without a doubt.', 'Yes definitely.',
            'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.',
            'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.',
            'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
            'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.',
            'Very doubtful.',
        ];
        const randomMessage = () => msg[Math.floor(Math.random() * msg.length)];
        const embed = new EmbedBuilder().addFields(
            { name: 'Question:', value: `${question}` },
            { name: 'Answer:', value: `${randomMessage()}` },
        );
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        if (message.channel) message.react('🎱');
    },
};
