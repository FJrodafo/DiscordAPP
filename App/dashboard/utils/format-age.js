function formatAge(timestampMs) {
    const total = Math.floor((Date.now() - timestampMs) / 1000 / 86400);
    const y = Math.floor(total / 365);
    const m = Math.floor((total % 365) / 30);
    const d = (total % 365) % 30;
    return `${y}y ${m}m ${d}d`;
}

module.exports = { formatAge };
