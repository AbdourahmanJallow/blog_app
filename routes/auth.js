const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    getMe,
    updateUser
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUser);

module.exports = router;
