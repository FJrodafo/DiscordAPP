const express = require('express');
const router = express.Router();

module.exports = (client) => {
    router.get('/', (_, res) => {
        const mem = process.memoryUsage();
        const cpu = process.cpuUsage();
        const uptime = Math.floor(process.uptime());
        const guilds = client.guilds?.cache?.size ?? 0;
        const users = client.users?.cache?.size ?? 0;

        res.set('Content-Type', 'text/plain');
        res.send(`
# HELP discord_bot_up Is the bot online
# TYPE discord_bot_up gauge
discord_bot_up ${client.isReady() ? 1 : 0}

# HELP discord_bot_ping Websocket ping
# TYPE discord_bot_ping gauge
discord_bot_ping ${client.ws?.ping ?? 0}

# HELP process_uptime_seconds Process uptime
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptime}

# HELP process_cpu_user_microseconds_total CPU user time
# TYPE process_cpu_user_microseconds_total counter
process_cpu_user_microseconds_total ${cpu.user}

# HELP process_cpu_system_microseconds_total CPU system time
# TYPE process_cpu_system_microseconds_total counter
process_cpu_system_microseconds_total ${cpu.system}

# HELP process_memory_rss_bytes Resident Set Size
# TYPE process_memory_rss_bytes gauge
process_memory_rss_bytes ${mem.rss}

# HELP process_memory_heap_used_bytes Heap used
# TYPE process_memory_heap_used_bytes gauge
process_memory_heap_used_bytes ${mem.heapUsed}

# HELP process_memory_heap_total_bytes Heap total
# TYPE process_memory_heap_total_bytes gauge
process_memory_heap_total_bytes ${mem.heapTotal}

# HELP discord_guilds_total Total guilds
# TYPE discord_guilds_total gauge
discord_guilds_total ${guilds}

# HELP discord_users_cached Cached users
# TYPE discord_users_cached gauge
discord_users_cached ${users}
`.trim());
    });

    return router;
};
