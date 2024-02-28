const express = require('express');
const router = express.Router();
const {
    getUser,
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
