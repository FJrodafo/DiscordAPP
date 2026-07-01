const { Events } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_MS = 60_000; // 1 minute

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
        if (message.content.toLowerCase() === 'hi') {
            if (cooldowns.has('hi') && Date.now() - cooldowns.get('hi') < COOLDOWN_MS) return;
            await message.channel.send('hi');
            cooldowns.set('hi', Date.now());
        }
    },
};
