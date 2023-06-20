const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500; 
    err.message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statuscode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }else if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}
        error.message = err.message;
        
        // Wrong Mongoose Object ID Error 
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }
        // Handling Mongoose Duplicate key errors
        if (err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        
        }
        // Handling Wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token Is Invalid, Try again!'
            error = new ErrorHandler(message, 400)
        }

        // Handling EXPIRED JWT
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token Is EXPIRED, Try again!'
            error = new ErrorHandler(message, 400)
        }
        


        res.status(err.statuscode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })

    }else{
        res.status(err.statuscode).json({
            success: false,
            error: error.message
        })
    }
    
}
