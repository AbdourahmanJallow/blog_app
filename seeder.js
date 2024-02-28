const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const User = require('./models/User');
const Blog = require('./models/Blog');
const connectDB = require('./config/dbConnection');
require('colors');

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/data/users.json`),
    'utf-8'
);
const blogs = JSON.parse(
    fs.readFileSync(`${__dirname}/data/blogs.json`),
    'utf-8'
);

mongoose.connect(process.env.MONGODB_URI);

// Add data to database
const addData = async () => {
    try {
        await User.create(users);
        await Blog.create(blogs);

        console.log('Data Imported'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err.message);
    }
};

// Delete data to database
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Blog.deleteMany();

        console.log('Data Destroyed'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err.message);
    }
};

if (process.argv[2] === '-i') {
    addData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
