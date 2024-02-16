const express = require('express');
const router = express.Router();
const { handleRegister } = require('../controllers/auth');

router.post('/', handleRegister);

module.exports = router;
