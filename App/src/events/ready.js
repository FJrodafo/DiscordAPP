const { Events, ActivityType } = require('discord.js');
const dashboard = require('./../../dashboard/index.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const status = [
            { activities: [{ name: 'I respond to DMs', type: ActivityType.Custom }], status: 'online' },
            { activities: [{ name: 'custom', type: ActivityType.Custom, state: 'What\'s on your mind?' }], status: 'online' },
            { activities: [{ name: 'Music', type: ActivityType.Listening }], status: 'idle' },
            { activities: [{ name: 'Movies', type: ActivityType.Watching }], status: 'dnd' },
            { activities: [{ name: 'Video Games', type: ActivityType.Playing }], status: 'idle' },
            { activities: [{ name: 'Video Games', type: ActivityType.Competing }], status: 'dnd' },
            { activities: [{ name: 'Video Games', type: ActivityType.Streaming, url: 'https://www.twitch.tv/directory' }] },
        ];
        function updateStatus() {
            const random = Math.floor(Math.random() * status.length);
            client.user.setPresence(status[random]);
        }
        updateStatus();
        setInterval(updateStatus, 600_000);
        dashboard(client);
    },
};
