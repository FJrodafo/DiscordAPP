const express = require('express');
const router = express.Router();
const { formatAge } = require('./../utils/format-age.js');
const { formatTime } = require('./../utils/format-time.js');

module.exports = (client) => {
    router.get('/', (_, res) => {
        try {
            res.json({
                app: {
                    id: client.user.id,
                    username: client.user.username,
                    tag: client.user.tag,
                    discriminator: client.user.discriminator,
                    avatarURL: {
                        webp: client.user.displayAvatarURL({ dynamic: true }),
                        png: client.user.displayAvatarURL({ dynamic: true }).replace('webp', 'png'),
                    },
                    createdAt: client.user.createdAt,
                    createdTimestamp: formatAge(client.user.createdTimestamp),
                },
                status: {
                    online: client.isReady(),
                    status: client.isReady() ? 'Online' : 'Offline',
                    presence: client.user.presence?.status ?? 'unknown',
                    activity: client.user.presence?.activities[0]?.name ?? 'None',
                    activityType: client.user.presence?.activities[0]?.type ?? 'None',
                    readyTimestamp: formatTime(Math.floor((Date.now() - client.readyTimestamp) / 1000)),
                    ping: client.ws.ping,
                },
                commands: {
                    total: client.commands.size,
                    commandsList: Array.from(client.commands.keys()),
                    cooldowns: client.cooldowns.size,
                    events: client.eventNames().length,
                    eventsList: client.eventNames(),
                },
                guilds: {
                    total: client.guilds.cache.size,
                    guildUsers: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
                    averageMembers: Math.round(client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0) / client.guilds.cache.size),
                    largestGuild: client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first()?.name ?? 'N/A',
                    smallestGuild: client.guilds.cache.sort((a, b) => a.memberCount - b.memberCount).first()?.name ?? 'N/A',
                    guildsDetails: client.guilds.cache.map(g => ({
                        id: g.id,
                        name: g.name,
                        members: g.memberCount,
                        channels: g.channels.cache.size,
                        bots: g.members.cache.filter(m => m.user.bot).size,
                    })),
                },
                cache: {
                    cachedUsers: client.users.cache.size,
                    cachedChannels: client.channels.cache.size,
                    cachedRoles: client.guilds.cache.reduce((acc, g) => acc + g.roles.cache.size, 0),
                    cachedEmojis: client.guilds.cache.reduce((acc, g) => acc + g.emojis.cache.size, 0),
                },
                system: {
                    uptime: formatTime(Math.floor(process.uptime())),
                    memoryRSS: Math.round(process.memoryUsage().rss / 1024 / 1024),
                    memoryHeapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    memoryHeapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    cpuUsage: process.cpuUsage(),
                    pid: process.pid,
                    version: process.version,
                    platform: process.platform,
                    arch: process.arch,
                },
            });
        }
        catch (err) {
            console.error('Error generating API response:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};
