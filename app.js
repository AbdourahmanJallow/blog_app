require('dotenv').config();
require('colors');

const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const path = require('path');
const PORT = process.env.PORT || 8700;

// Middleware
const errorHandler = require('./middleware/error');

const blogs = require('./routes/blogs');
const users = require('./routes/users');
const auth = require('./routes/auth');

// Database connection
connectDB();

const app = express();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false })); // MIDDLEWARE  FOR URL ENCODED FORM DATA
app.use(express.json()); // MIDDLEWARE FOR BUILT-IN JSON
app.use(cookieParser()); // MIDDLEWARE FOR COOKIES

// Serve static fiels
app.use(express.static(path.join(__dirname, 'public')));

// File uplaoad
app.use(fileUpload());

app.use('/api/v1/blogs', blogs);
app.use('/api/v1/auth/users', users); // Admin route
app.use('/api/v1/auth', auth); // Authentication route

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('MongoDB connected succesfully'.cyan.bold);
    app.listen(PORT, () =>
        console.log(
            `Server listening for requests on port ${PORT}`.blue.underline
        )
    );
});

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error: ${err.message}`.red);

//     // close server & exit process
//     server.close(() => process.exit(1));
// });
