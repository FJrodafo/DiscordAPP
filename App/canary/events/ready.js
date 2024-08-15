const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const jsonPath = './../database/games/names.json';
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
                    state: '🍋',
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
