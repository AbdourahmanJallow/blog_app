const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateUser,
    uploadProfilePhoto,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const uploadPhoto = require('../middleware/uploadPhoto');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

router.use(protect);
router.get('/me', getMe);
router.put(
    '/uploadprofilephoto',
    uploadPhoto(User, 'User', 'profilePhoto'),
    uploadProfilePhoto
);
router.put('/updatedetails', updateUser);

module.exports = router;
