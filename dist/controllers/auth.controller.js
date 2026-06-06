"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const audit_1 = require("../utils/audit");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            await (0, audit_1.logAudit)({
                userId: result.user.id,
                action: 'USER_REGISTER',
                entity: 'User',
                entityId: result.user.id,
                ip: req.ip
            });
            res.status(201).json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            await (0, audit_1.logAudit)({
                userId: result.user.id,
                action: 'USER_LOGIN',
                entity: 'User',
                entityId: result.user.id,
                ip: req.ip
            });
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    data: null,
                    meta: null,
                    error: { code: 'BAD_REQUEST', message: 'Refresh token is required' }
                });
            }
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async logout(req, res, next) {
        try {
            if (req.user) {
                await (0, audit_1.logAudit)({
                    userId: req.user.id,
                    action: 'USER_LOGOUT',
                    entity: 'User',
                    entityId: req.user.id,
                    ip: req.ip
                });
            }
            res.json({ data: { message: 'Logged out successfully' }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMe(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.getMe(req.user.id);
            res.json({ data: user, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.updateProfile(req.user.id, req.body);
            await (0, audit_1.logAudit)({
                userId: req.user.id,
                action: 'USER_PROFILE_UPDATE',
                entity: 'User',
                entityId: req.user.id,
                ip: req.ip
            });
            res.json({ data: user, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
