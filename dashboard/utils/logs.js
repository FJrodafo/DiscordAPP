const logs = [];

/**
 * Adds a log to the array and prints it to the console
 * @param {string} message
 */
function add(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}`;
    logs.push(entry);

    if (logs.length > 2000) logs.shift();

    console.log(entry);
}

function getAll() { return logs; }

module.exports = { add, getAll };
