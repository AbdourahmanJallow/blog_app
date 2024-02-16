const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
} = require('../errors/index');

const handleRegister = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email)
        return res.status(400).json({
            message: 'Invalid username, email or password.'
        });

    // check for duplicate
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate)
        return res.status(409).json({
            message: 'Duplicate username, please provide another username'
        });

    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPwd
        });

        res.status(201).json({ user });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
        console.log(err);
    }
};

const handleLogin = async (req, res) => {
    const { password, email } = req.body;

    if (!password || !email)
        return new BadRequestError('Invalid email or password.');

    const user = await User.findOne({ email }).exec();
    if (!user)
        return res
            .status(StatusCodes.CONFLICT)
            .json({ message: 'No user found' });

    const matchedUser = await bcrypt.compare(password, user.password);

    if (!matchedUser)
        return res.status(409).json({ message: 'Password mismatch' });

    try {
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();

        user.refreshToken = refreshToken;
        const result = await user.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
        console.log(err);
    }
};

const handleLogout = async (req, res) => {
    const cookies = req?.cookies;
    if (!cookies.jwt) return res.sendStatus(StatusCodes.NO_CONTENT);

    const refreshToken = cookies?.jwt;

    try {
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
            res.clearCookie('jwt', {
                httpOnly: true
            });

            res.sendStatus(StatusCodes.NO_CONTENT);
        }

        user.refreshToken = '';
        const result = await user.save();
        console.log(result);

        res.clearCookie('jwt', { httpOnly: true });
        // res.sendStatus(StatusCodes.NO_CONTENT);
        res.json({ message: `${user.username} logout successfull` });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const handleRefreshToken = async (req, res) => {
    const cookies = req?.cookies;
    if (!cookies.jwt) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const refreshToken = cookies.jwt;

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(StatusCodes.FORBIDDEN);

        const userRoles = Object.values(user.roles);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
                if (err || payload.email !== user.email)
                    return res.sendStatus(StatusCodes.FORBIDDEN);

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            userID: payload.userID,
                            email: payload.email,
                            roles: userRoles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '240s' }
                );

                res.json({ accessToken });
            }
        );
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
        console.log(error);
    }
};

module.exports = {
    handleLogin,
    handleRegister,
    handleLogout,
    handleRefreshToken
};
