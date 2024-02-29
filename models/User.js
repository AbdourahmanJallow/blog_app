const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: slugify } = require('slugify');

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
        username: String,
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false
        },
        blogs: {
            type: [Schema.Types.ObjectId],
            ref: 'Blog'
        },
        role: {
            type: String,
            enum: ['user', 'publisher'],
            default: 'user'
        },
        token: String
    },
    // {
    //     toJSON: { virtuals: true },
    //     toObject: { virtuals: true }
    // },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    // add username
    // this.slug = slugify(this.name, { lower: true });

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

userSchema.methods.comparePassword = async function (password) {
    const matchedUser = await bcrypt.compare(password, this.password); // compare passwords
    return matchedUser;
};

// Reverse populate the blogs
// userSchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'author',
//     justOne: 'false'
// });

module.exports = mongoose.model('User', userSchema);
