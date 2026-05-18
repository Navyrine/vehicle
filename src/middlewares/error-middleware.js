import {logger} from "../logger/logger.js";
import { ResponseError } from "../error/ResponseError.js";

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ResponseError ? err.statusCode : 500;
    const isOperational = err instanceof ResponseError;

    logger.error("Application Error", {
        errorMessage: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        ip: req.ip
    });

    res.status(statusCode).json({
        status_code: statusCode,
        error: isOperational ? err.message : "Internal server error"
    });
}