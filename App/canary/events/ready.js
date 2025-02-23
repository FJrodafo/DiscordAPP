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
        // Watching
        const moviesJsonPath = path.resolve(__dirname, './../database/movies/names.json');
        const moviesData = require(moviesJsonPath);
        const randomMovie = Math.floor(Math.random() * moviesData.length);
        // Games
        const gamesJsonPath = path.resolve(__dirname, './../database/games/names.json');
        const gamesData = require(gamesJsonPath);
        const randomGame = Math.floor(Math.random() * gamesData.length);
        // Status
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
            { activities: [{ name: moviesData[randomMovie], type: ActivityType.Watching }], status: 'dnd' },
            // Games
            { activities: [{ name: gamesData[randomGame], type: ActivityType.Playing }], status: 'idle' },
            { activities: [{ name: gamesData[randomGame], type: ActivityType.Competing }], status: 'dnd' },
            { activities: [{ name: gamesData[randomGame], type: ActivityType.Streaming, url: 'https://www.twitch.tv/directory' }] },
        ];
        function updateStatus() {
            const random = Math.floor(Math.random() * status.length);
            client.user.setPresence(status[random]);
        }
        updateStatus();
        setInterval(updateStatus, 4_000_000);
    },
};
