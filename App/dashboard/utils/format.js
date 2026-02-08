function formatAge(timestampMs) {
    const total = Math.floor((Date.now() - timestampMs) / 1000 / 86400);

    const y = Math.floor(total / 365);
    const m = Math.floor((total % 365) / 30);
    const d = (total % 365) % 30;

    return `${y}y ${m}m ${d}d`;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${h}h ${m}m ${s}s`;
}

function formatMemory() {
    const mem = process.memoryUsage();

    const toMB = v => Math.round(v / 1024 / 1024);

    return {
        rss: `${toMB(mem.rss)} MB`,
        heapUsed: `${toMB(mem.heapUsed)} MB`,
        heapTotal: `${toMB(mem.heapTotal)} MB`,
        external: `${toMB(mem.external)} MB`,
        usagePercent: `${Math.round((mem.heapUsed / mem.heapTotal) * 100)}%`,
    };
}

let lastCPU = process.cpuUsage();
let lastTime = Date.now();

function formatCPU() {
    const now = Date.now();
    const usage = process.cpuUsage(lastCPU);

    const elapsedMs = now - lastTime;
    const elapsedMicros = elapsedMs * 1000;

    const percent = ((usage.user + usage.system) / elapsedMicros) * 100;

    lastCPU = process.cpuUsage();
    lastTime = now;

    return {
        percent: `${percent.toFixed(2)}%`,
        user: `${(usage.user / 1000).toFixed(2)} ms`,
        system: `${(usage.system / 1000).toFixed(2)} ms`,
    };
}

module.exports = {
    formatAge,
    formatTime,
    formatMemory,
    formatCPU,
};
