const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Bot-Check')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        let embed, message;
        if (interaction.targetUser.bot) {
            embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.targetUser.tag} is a BOT!`, iconURL: `${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                .setColor(0xFFFFFF);
            message = await interaction.reply({ embeds: [embed], fetchReply: true });
            message.react('🤖');
        }
        else {
            embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.targetUser.tag} is not a BOT.`, iconURL: `${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                .setColor(0xFFFFFF);
            message = await interaction.reply({ embeds: [embed], fetchReply: true });
            message.react('👤');
        }
    },
};
