const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name.']
    },
    email: {
        type: String,
        required: [true, 'Please add an email.'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    blogs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Blog'
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    profilePhoto: String,
    // accessToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encryptpassword
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Sign JWT and return
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    });
};

// Compare user password to entererd password
UserSchema.methods.comparePassword = async function (pwd) {
    const isMatch = await bcrypt.compare(pwd, this.password);
    return isMatch;
};

// Generate and hash reset password token
UserSchema.methods.generateResetPasswordToken = function () {
    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // Hash token and reset password token
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Set expiration
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return token;
};

// // Reverse populate the blogs
// // userSchema.virtual('blogs', {
// //     ref: 'Blog',
// //     localField: '_id',
// //     foreignField: 'author',
// //     justOne: 'false'
// // });

module.exports = mongoose.model('User', UserSchema);
