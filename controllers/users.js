const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');

// @description     Fetch single user
// routes           GET api/v1/auth/users/:id
// @access          private
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.id} not found.`)
        );
    }

    res.status(200).json({ success: true, data: user });
});

// @description     Fetch All users
// routes           GET api/v1/auth/users
// @access          private
const getUsers = asyncHandler(async (req, res, next) => {
    if (!req.user || (req.user && req.user.role !== 'admin')) {
        return next(
            new ErrorResponse('Not authorized to access this route.', 403)
        );
    }

    res.status(200).json(res.advancedResults);
});

// @description     Delete User
// routes           DELETE api/v1/auth/users/:id
// @access          private
const deleteUser = asyncHandler(async (req, res, next) => {
    if (!req.user || (req.user && req.user.role !== 'admin')) {
        return next(
            new ErrorResponse('Not authorized to access this route.', 403)
        );
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.id} not found.`)
        );
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
});

// @description     Update User
// routes           PUT api/v1/auth/users/:id
// @access          private
const updateUser = asyncHandler(async (req, res, next) => {
    if (!req.user || (req.user && req.user.role !== 'admin')) {
        return next(
            new ErrorResponse('Not authorized to access this route.', 403)
        );
    }

    let user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.id} not found.`)
        );
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: user });
});

module.exports = {
    getUser,
    getUsers,
    updateUser,
    deleteUser
};
