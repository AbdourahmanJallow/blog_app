const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    refreshToken
} = require('../controllers/auth');

router.post('/register', register);
router.get('/login', login);

module.exports = router;
