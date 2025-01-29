const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,

    /**
     * GatewayIntentBits.MessageContent must be enabled in the index.js file
     *
     * @param {*} message
     * @returns messages depending on the content
     */
    async execute(message) {
        if (message.author.bot) return;
        if (message.content.toLowerCase() === 'hi') await message.channel.send('hi');
    },
};
