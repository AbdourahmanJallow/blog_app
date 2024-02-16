const express = require('express');
const router = express.Router();
const { handleLogin } = require('../controllers/auth');

router.post('/', handleLogin);

module.exports = router;
