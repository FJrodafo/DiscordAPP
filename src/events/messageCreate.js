const { Events } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_MS = 60_000;

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
        if (message.content.toLowerCase() === 'hello') {
            if (cooldowns.has('hello') && Date.now() - cooldowns.get('hello') < COOLDOWN_MS) return;
            await message.channel.send('Hello, World!');
            cooldowns.set('hello', Date.now());
        }
    },
};
