const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    const token = user.generateAccessToken();

    res.status(200).json({ success: true, token });
});

const login = asyncHandler(async (req, res) => {
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

    const match = user.comparePassword(password);

    if (!match) return next(new ErrorResponse(`Invalid credentails.`, 401));

    sendResponseToken(user, 200, res);
});

const logout = asyncHandler(async (req, res) => {
    const user = await User.findOne(req.cookies.token).exec();
    if (!user) {
        res.clearCookie('token', {
            httpOnly: true
        });

        res.sendStatus(201);
    }

    user.token = '';
    await user.save();

    res.clearCookie('token', { httpOnly: true });

    res.status(200).json({ success: true });
});

// const refreshToken = asyncHandler(async (req, res) => {
//     const user = await User.findOne(req.cookies.token);
//     if (!user)
//         return next(new ErrorResponse('Not authorized to access route', 401));

//     jwt.verify(
//         req.cookies.token,
//         process.env.REFRESH_TOKEN_SECRET,
//         (err, payload) => {
//             if (err || payload.id !== user._id)
//                 return next(
//                     new ErrorResponse('FORBIDDEN to access route', 403)
//                 );

//             const token = jwt.sign(
//                 {
//                     id: payload.id
//                 },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: '240s' }
//             );

//             res.json({ token });
//         }
//     );
// });

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
    logout
    // refreshToken
};
