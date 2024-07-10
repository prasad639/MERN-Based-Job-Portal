import { startSession } from "mongoose";

class ErrorHandler extends Error{
constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode;

}
}

export const errorMiddleware = (err, req, res, next ) =>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err ===  "casteError"){
        const message = `Resource not found ${err}`;
        err = new ErrorHandler(message, 400);
    }
    if(err ===  11000){  // Authentication related error
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if(err ===  "jsonWebTokenError"){
        const message = `josn web token is invalid try again`;
        err = new ErrorHandler(message, 400);
    }
    if(err ===  "TokenExpiredError"){
        const message = `json web token is expired try again`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success : false,
        message: err.message,
    });

};

export default ErrorHandler;