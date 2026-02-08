const express = require('express');
const http = require('node:http');
const path = require('node:path');
const { findAvailablePort } = require('@fjrodafo/port-finder');

module.exports = (client) => {
    const app = express();
    const server = http.createServer(app);
    const apiRoutes = require('./routes/api.js')(client);
    const logsRoutes = require('./routes/logs.js')();
    const metricsRoute = require('./routes/metrics.js')(client);
    const desiredPort = process.env.PORT ?? 3000;

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/api', apiRoutes);
    app.use('/logs', logsRoutes);
    app.use('/metrics', metricsRoute);

    findAvailablePort(desiredPort).then(port => {
        server.listen(port, () => {
            console.log(`Dashboard --> http://localhost:${port}`);
        });
    }).catch(err => {
        console.error('Error searching for available port:', err);
    });
};
