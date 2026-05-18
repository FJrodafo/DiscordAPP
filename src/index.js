const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Cooldowns
client.cooldowns = new Collection();

// Command handling
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Error handling and reconnection
client.on('error', error => {
    console.error('Error in client:', error);
});

const handleReconnect = () => {
    console.log('Attempting to reconnect...');
    client.login(token).catch(err => {
        console.error('Failed to reconnect:', err);
        // Try to reconnect after 5 seconds
        setTimeout(handleReconnect, 5000);
    });
};

client.on('shardDisconnect', (event, id) => {
    console.warn(`Shard ${id} disconnected (${event.code}): ${event.reason}`);
    if (event.code === 1000) {
        return;
    }
    handleReconnect();
});

// Log in to Discord with your client's token
client.login(token).catch(error => {
    console.error('Failed to login:', error);
});
