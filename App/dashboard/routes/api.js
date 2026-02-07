const express = require('express');
const router = express.Router();
const { formatTime } = require('./../utils/format-time.js');

module.exports = (client) => {
    router.get('/', (_, res) => {
        res.json({
            app: {
                username: client.user.username,
                tag: client.user.tag,
                id: client.user.id,
            },
            status: {
                online: client.isReady(),
                status: client.isReady() ? 'Online' : 'Offline',
                presence: client.user.presence?.status ?? 'unknown',
                readyTimestamp: formatTime(Math.floor((Date.now() - client.readyTimestamp) / 1000)),
                ping: client.ws.ping,
            },
            commands: {
                total: client.commands.size,
                cooldowns: client.cooldowns.size,
                events: client.eventNames().length,
            },
            guilds: {
                total: client.guilds.cache.size,
                guildUsers: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
                largestGuild: client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first()?.name ?? 'N/A',
                smallestGuild: client.guilds.cache.sort((a, b) => a.memberCount - b.memberCount).first()?.name ?? 'N/A',
            },
            cache: {
                cachedUsers: client.users.cache.size,
                cachedChannels: client.channels.cache.size,
            },
            system: {
                uptime: formatTime(process.uptime()),
                memory: Math.round(process.memoryUsage().rss / 1024 / 1024),
                pid: process.pid,
                version: process.version,
                platform: process.platform,
                arch: process.arch,
            },
        });
    });

    return router;
};
