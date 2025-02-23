const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'admin',
    data: new SlashCommandBuilder()
        .setName('dm-remover')
        .setDescription('Delete a specific direct message by its ID!')
        .setDefaultMemberPermissions(0)
        .addStringOption(option => option
            .setName('message_id')
            .setDescription('Message ID to delete!')
            .setRequired(true),
        ),
    async execute(interaction) {
        if (interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in direct messages.', ephemeral: true });
        }

        const messageId = interaction.options.getString('message_id');

        if (!/^\d+$/.test(messageId)) {
            return interaction.reply({ content: 'Please provide a valid message ID.', ephemeral: true });
        }

        try {
            const channel = await interaction.user.createDM();
            const message = await channel.messages.fetch(messageId);

            if (message && message.author.id === interaction.client.user.id) {
                await message.delete();
                return interaction.reply({ content: 'The message was successfully deleted.', ephemeral: true });
            }
            else {
                return interaction.reply({ content: 'Message not found or cannot be deleted.', ephemeral: true });
            }
        }
        catch (error) {
            // DiscordAPIError[10008]: Unknown Message
            if (error.code === 10_008) {
                return interaction.reply({ content: 'Message not found or cannot be deleted.', ephemeral: true });
            }
            else {
                console.error('Error deleting message:', error);
                return interaction.reply({ content: 'There was an error trying to delete the message.', ephemeral: true });
            }
        }
    },
};
