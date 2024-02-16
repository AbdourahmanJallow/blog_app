const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username.'],
            minlength: 3,
            maxlength: 15
        },
        email: {
            type: String,
            required: [true, 'Please provide email.'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email'
            ],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8
        },
        roles: {
            User: {
                type: Number,
                default: 1337
            },
            Admin: Number
        },
        refreshToken: String
    },
    { timestamps: true }
);

// userSchema.pre('save', async function () {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

userSchema.methods.createAccessToken = function () {
    return jwt.sign(
        {
            userInfo: {
                userID: this._id,
                email: this.email,
                roles: this.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

userSchema.methods.createRefreshToken = function () {
    return jwt.sign(
        {
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '2d' }
    );
};

// userSchema.methods.comparePassword = async function (password) {
//     const matchedUser = await bcrypt.compare(password, this.password); // compare passwords
//     return matchedUser;
// };

module.exports = mongoose.model('User', userSchema);
