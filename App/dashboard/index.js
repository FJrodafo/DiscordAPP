const express = require('express');
const http = require('node:http');
const path = require('node:path');
const { findAvailablePort } = require('@fjrodafo/port-finder');

module.exports = (client) => {
    const app = express();
    const server = http.createServer(app);
    const desiredPort = process.env.PORT ?? 3000;

    app.use(
        express.static(
            path.join(__dirname, 'public'),
        ),
    );

    app.get('/api/info', (_, res) => {
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

    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        return `${h}h ${m}m ${s}s`;
    }

    findAvailablePort(desiredPort).then(port => {
        server.listen(port, () => {
            console.log(`Dashboard running at http://localhost:${port}`);
            console.log(`Dashboard API at http://localhost:${port}/api/info`);
        });
    }).catch(err => {
        console.error('Error searching for available port:', err);
    });
};
