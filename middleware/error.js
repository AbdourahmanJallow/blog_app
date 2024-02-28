const ErrorResponse = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Object cast error | When mongoose failed to cast the id provided
    if (err.name === 'CastError') {
        const message = `resource with id ${req.params.id} not found`;
        error = new ErrorResponse(message, 404);
    }

    // Check for mongoose duplicate errors
    if (err.code === 11000) {
        const message = `Duplicate key value for ${JSON.stringify(
            err.keyValue
        )}`;
        error = new ErrorResponse(message, 400);
    }

    // Check for validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

module.exports = errorHandler;
