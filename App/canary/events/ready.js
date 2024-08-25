const {
    Events,
    ActivityType,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const logPath = path.resolve(__dirname, './../database/log.txt');
        const date = new Date(), timestamp = date.toLocaleString();
        const readyMessage = `Ready! Logged in as ${client.user.tag}`;
        const serverCount = `Server count: ${client.guilds.cache.size}`;
        const logMessage = `${timestamp} - ${readyMessage} ${serverCount}\n`;
        fs.appendFileSync(logPath, logMessage, 'utf8');
        console.log(`${readyMessage}\n${serverCount}`);

        const jsonPath = path.resolve(__dirname, './../database/games/names.json');
        const data = require(jsonPath);
        const randomGame = Math.floor(Math.random() * data.length);
        const status = [
            // Custom
            { activities: [{ name: 'I respond to DMs', type: ActivityType.Custom }], status: 'online' },
            { activities: [{ name: '/help', type: ActivityType.Custom }], status: 'online' },
            {
                activities: [{
                    // name is exposed through the API but not shown in the client for ActivityType.Custom
                    name: 'custom',
                    type: ActivityType.Custom,
                    state: '🐥',
                }],
                status: 'online',
            },

            // Listening
            { activities: [{ name: 'me', type: ActivityType.Listening }], status: 'idle' },

            // Watching
            { activities: [{ name: 'One Piece', type: ActivityType.Watching }], status: 'dnd' },

            // Games
            { activities: [{ name: data[randomGame], type: ActivityType.Playing }], status: 'idle' },
            { activities: [{ name: data[randomGame], type: ActivityType.Competing }], status: 'dnd' },
            { activities: [{ name: data[randomGame], type: ActivityType.Streaming, url: 'https://www.twitch.tv/directory' }] },
        ];
        function updateStatus() {
            const random = Math.floor(Math.random() * status.length);
            client.user.setPresence(status[random]);
        }
        updateStatus();
        setInterval(updateStatus, 4_000_000);
    },
};
