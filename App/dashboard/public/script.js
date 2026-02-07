function updateInfo() {
    fetch('/api/info')
        .then(res => res.json())
        .then(data => {
            document.getElementById('username').innerText = data.app.username;
            document.getElementById('tag').innerText = data.app.tag;
            document.getElementById('id').innerText = data.app.id;

            document.getElementById('online').innerText = data.status.online;
            document.getElementById('status').innerText = data.status.status;
            document.getElementById('presence').innerText = data.status.presence;
            document.getElementById('readyTimestamp').innerText = data.status.readyTimestamp;
            document.getElementById('ping').innerText = data.status.ping + ' ms';

            document.getElementById('commands').innerText = data.commands.total;
            document.getElementById('cooldowns').innerText = data.commands.cooldowns;
            document.getElementById('events').innerText = data.commands.events;

            document.getElementById('guilds').innerText = data.guilds.total;
            document.getElementById('guildUsers').innerText = data.guilds.guildUsers;
            document.getElementById('largestGuild').innerText = data.guilds.largestGuild;
            document.getElementById('smallestGuild').innerText = data.guilds.smallestGuild;

            document.getElementById('cachedUsers').innerText = data.cache.cachedUsers;
            document.getElementById('cachedChannels').innerText = data.cache.cachedChannels;

            document.getElementById('uptime').innerText = data.system.uptime;
            document.getElementById('memory').innerText = data.system.memory + ' MB';
            document.getElementById('pid').innerText = data.system.pid;
            document.getElementById('version').innerText = data.system.version;
            document.getElementById('platform').innerText = data.system.platform;
            document.getElementById('arch').innerText = data.system.arch;
        })
        .catch(err => {
            console.error('Error retrieving information:', err);
        });
}

updateInfo();
setInterval(updateInfo, 10000);
