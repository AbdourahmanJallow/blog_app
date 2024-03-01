const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('./async');
const User = require('../models/User');

// @description     add protection to private routes
// Allow only admins or loggedIn user to access private routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token is valid
    if (!token) {
        return next(new ErrorResponse('Not authorized to access route.', 401));
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.log(error.message);
        return next(new ErrorResponse('Authentication failed.', 500));
    }
});

// Grant access to a particular user role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} Not authorized to access this route.`,
                    403
                )
            );
        }

        next();
    };
};
