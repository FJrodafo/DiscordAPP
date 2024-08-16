const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('bot-scanner')
        .setDescription('Are you a bot?')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Type a user!')
            .setRequired(false),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        let embed, message;
        if (user.bot) {
            embed = new EmbedBuilder().setAuthor({ name: `${user.tag} is a BOT!`, iconURL: `${user.displayAvatarURL({ dynamic: true, size: 512 })}` });
            message = await interaction.reply({ embeds: [embed], fetchReply: true });
            if (message.channel) message.react('🤖');
        }
        else {
            embed = new EmbedBuilder().setAuthor({ name: `${user.tag} is not a BOT.`, iconURL: `${user.displayAvatarURL({ dynamic: true, size: 512 })}` });
            message = await interaction.reply({ embeds: [embed], fetchReply: true });
            if (message.channel) message.react('👤');
        }
    },
};
