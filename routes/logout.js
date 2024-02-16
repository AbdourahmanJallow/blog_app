const express = require('express');
const router = express.Router();
const { handleLogout } = require('../controllers/auth');

router.post('/', handleLogout);

module.exports = router;
