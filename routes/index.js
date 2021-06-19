const express = require('express');
const router = express.Router();
const boardRoutes = require('./board');
const userRoutes = require('./user');

router.use('/board', boardRoutes);

router.use('/user', userRoutes);

module.exports = {
    router
};
