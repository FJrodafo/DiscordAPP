const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`Server count: ${client.guilds.cache.size}`);
        const status = [
            { activities: [{ name: 'I respond to DMs', type: ActivityType.Custom }], status: 'online' },
            { activities: [{ name: 'custom', type: ActivityType.Custom, state: 'What\'s on your mind?' }], status: 'online' },
            { activities: [{ name: 'music', type: ActivityType.Listening }], status: 'idle' },
            { activities: [{ name: 'movies', type: ActivityType.Watching }], status: 'dnd' },
            { activities: [{ name: 'video games', type: ActivityType.Playing }], status: 'idle' },
            { activities: [{ name: 'video games', type: ActivityType.Competing }], status: 'dnd' },
            { activities: [{ name: 'video games', type: ActivityType.Streaming, url: 'https://www.twitch.tv/directory' }] },
        ];
        function updateStatus() {
            const random = Math.floor(Math.random() * status.length);
            client.user.setPresence(status[random]);
        }
        updateStatus();
        setInterval(updateStatus, 600_000);
    },
};
