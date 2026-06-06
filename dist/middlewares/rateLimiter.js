"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        data: null,
        meta: null,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again later.'
        }
    }
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 login requests per 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        data: null,
        meta: null,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many login attempts, please try again in 5 minutes.'
        }
    }
});
