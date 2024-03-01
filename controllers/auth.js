const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @description     Get Current logged-in User
// routes           GET api/v1/auth/me
// @access          private
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('blogs');
    res.status(200).json({ success: true, data: user });
});

// @description     Register User
// routes           POST api/v1/auth/register
// @access          public
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    const token = user.generateAccessToken();

    res.status(200).json({ success: true, token });
});

// @description     Login
// routes           POST api/v1/auth/login
// @access          public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new ErrorResponse(`Please provide email and password.`, 400)
        );
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse(`Invalid credentails.`, 401));
    }

    const match = await user.comparePassword(password);

    if (!match) return next(new ErrorResponse(`Invalid credentials.`, 401));

    sendResponseToken(user, 200, res);
});

// @description     Logout
// routes           GET api/v1/auth/logout
// @access          private
const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true });
});

// @description     Update User Details
// routes           PUT api/v1/auth/updatedetails
// @access          private
const updateUser = asyncHandler(async (req, res, next) => {
    // User cannot update their password here
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, user });
});

// @description     Forgot Password
// routes           POST api/v1/auth/forgotpassword
// @access          public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ErrorResponse(
                `User with email ${req.body.email} not found`,
                404
            )
        );
    }

    const resetPasswordToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // reset password route
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetpassword/${resetPasswordToken}`;

    // send email notification
    const message = `You are receiving this email because you (or someone else) has requested to reset password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user?.email,
            message,
            subject: 'Password Reset Token'
        });

        res.status(200).json({
            success: true,
            data: resetPasswordToken
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        next(new ErrorResponse(`Failed to send email.`, 500));
    }
});

// @description     Reset Password
// routes           POST api/v1/auth/resetpassword
// @access          private
const resetPassword = asyncHandler(async (req, res, next) => {
    // Create hash token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendResponseToken(user, 200, res);
});

const sendResponseToken = (user, statusCode, res) => {
    const token = user.generateAccessToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res.cookie('token', token, options);

    res.status(statusCode).json({ success: true, token });
};

module.exports = {
    login,
    register,
    logout,
    getMe,
    updateUser,
    forgotPassword,
    resetPassword
    // refreshToken
};
