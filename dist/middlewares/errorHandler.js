"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error(`${req.method} ${req.url} - Error: ${message}`, err.stack, err.details);
    return res.status(statusCode).json({
        data: null,
        meta: null,
        error: {
            code: err.name || 'INTERNAL_SERVER_ERROR',
            message,
            details: err.details || null
        }
    });
};
exports.errorHandler = errorHandler;
