const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name.'],
            minlength: 3
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
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'publisher'],
            default: 'user'
        },
        token: String
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
};

// userSchema.methods.createRefreshToken = function () {
//     return jwt.sign(
//         {
//             email: this.email
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: '2d' }
//     );
// };

userSchema.methods.comparePassword = async function (password) {
    const matchedUser = await bcrypt.compare(password, this.password); // compare passwords
    return matchedUser;
};

module.exports = mongoose.model('User', userSchema);
