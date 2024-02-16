require('dotenv').config();

const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const colors = require('colors');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 8700;

const blog = require('./routes/api/blog_route');
// Middleware
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false })); // MIDDLEWARE  FOR URL ENCODED FORM DATA
app.use(express.json()); // MIDDLEWARE FOR BUILT-IN JSON
app.use(cookieParser()); // MIDDLEWARE FOR COOKIES

// Routes
// app.use('/blogapi/register', require('./routes/register'));
// app.use('/blogapi/login', require('./routes/login'));
// app.use('/blogapi/logout', require('./routes/logout'));
// app.use('/blogapi/refresh', require('./routes/refresh'));

// app.use(verifyJWT);
app.use('/api/v1/blog', blog);
// app.use('/blogapi/users', require('./routes/api/users_route'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('MongoDB connected succesfully'.cyan.bold);
    app.listen(PORT, () =>
        console.log(
            `Server listening for requests on port ${PORT}`.blue.underline
        )
    );
});
