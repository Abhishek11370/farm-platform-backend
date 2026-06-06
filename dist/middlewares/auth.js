"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToken = exports.allow = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
        return res.status(401).json({
            data: null,
            meta: null,
            error: { code: 'UNAUTHORIZED', message: 'Authentication token missing' }
        });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const decoded = {
            id: payload.id,
            role: payload.role,
            email: payload.email,
        };
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            data: null,
            meta: null,
            error: { code: 'UNAUTHORIZED', message: 'Invalid or expired authentication token' }
        });
    }
};
exports.auth = auth;
const allow = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                data: null,
                meta: null,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                data: null,
                meta: null,
                error: { code: 'FORBIDDEN', message: 'Access denied: insufficient permissions' }
            });
        }
        next();
    };
};
exports.allow = allow;
const signAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
        expiresIn: '15m'
    });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
    });
};
exports.signRefreshToken = signRefreshToken;
