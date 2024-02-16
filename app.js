require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 8700;

connectDB();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false })); // MIDDLEWARE  FOR URL ENCODED FORM DATA
app.use(express.json()); // MIDDLEWARE FOR BUILT-IN JSON
app.use(cookieParser()); // MIDDLEWARE FOR COOKIES

// Routes
app.use('/blogapi/register', require('./routes/register'));
app.use('/blogapi/login', require('./routes/login'));
app.use('/blogapi/logout', require('./routes/logout'));
app.use('/blogapi/refresh', require('./routes/refresh'));

app.use(verifyJWT);
app.use('/blogapi/blog', require('./routes/api/blog_route'));
app.use('/blogapi/users', require('./routes/api/users_route'));

mongoose.connection.once('open', () => {
    console.log('MongoDB connected succesfully');
    app.listen(PORT, () =>
        console.log(`Server listening for requests on port ${PORT}`)
    );
});
