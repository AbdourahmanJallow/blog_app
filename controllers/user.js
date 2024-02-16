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

const getUser = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid user id' });

    try {
        const user = await User.findOne({ _id: id }).exec();
        if (!user)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'User not found' });

        res.status(StatusCodes.OK).json({
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'No Users.' });

        res.status(StatusCodes.OK).json({ users });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid user id.' });

    try {
        const user = await User.findOne({ _id: user_id }).exec();
        if (!user)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'User not found' });

        const result = await User.deleteOne({ _id: user_id }).exec();
        res.status(StatusCodes.OK).json({ deletedUser: result });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid user id' });

    try {
        const user = await User.findOne({ _id: user_id }).exec();
        if (!user)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'User not found' });

        if (req?.body?.username) user.username = req.body?.username;
        if (req?.body?.email) user.email = req.body?.email;

        const result = await user.save();
        res.status(StatusCodes.OK).json({ result });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
};
