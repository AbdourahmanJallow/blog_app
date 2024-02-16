const express = require('express');
const router = express.Router();
const { handleRefreshToken } = require('../controllers/auth');

router.post('/', handleRefreshToken);

module.exports = router;
