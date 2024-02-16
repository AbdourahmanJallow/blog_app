const allowedOrigins = ['http://localhost:8700', 'http:127.1.0.1:8700'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Invalid origin'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
