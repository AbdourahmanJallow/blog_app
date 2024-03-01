const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateUser,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUser);

module.exports = router;
