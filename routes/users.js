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

const blogRouter = require('./blogs');

// Re-route these routes to other resource routes
router.use('/:userId/blogs', blogRouter);

router
    .route('/')
    .get(
        advancedResults(User, {
            path: 'blogs',
            select: 'title content featuredImage'
        }),
        getUsers
    );

router.use(protect);
router.use(authorize('admin'));
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
