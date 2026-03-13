const express = require('express');
const router = express.Router();
const logs = require('./../utils/logs.js');

module.exports = () => {
    router.get('/', (_, res) => {
        res.json(logs.getAll());
    });

    return router;
};
