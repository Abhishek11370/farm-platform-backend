"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const audit_1 = require("../../utils/audit");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
/**
 * AuthController provides authentication related endpoints.
 */
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body, res, req, next) {
        try {
            const result = await this.authService.register(body);
            await (0, audit_1.logAudit)({
                userId: result.user.id,
                action: 'USER_REGISTER',
                entity: 'User',
                entityId: result.user.id,
                ip: req.ip,
            });
            res.status(201).json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    async login(body, res, req, next) {
        try {
            const result = await this.authService.login(body);
            await (0, audit_1.logAudit)({
                userId: result.user.id,
                action: 'USER_LOGIN',
                entity: 'User',
                entityId: result.user.id,
                ip: req.ip,
            });
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    async refresh(body, res, next) {
        try {
            const { refreshToken } = body;
            if (!refreshToken) {
                return res.status(400).json({
                    data: null,
                    meta: null,
                    error: { code: 'BAD_REQUEST', message: 'Refresh token is required' },
                });
            }
            const result = await this.authService.refresh(refreshToken);
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            if (req.user) {
                await (0, audit_1.logAudit)({
                    userId: req.user.id,
                    action: 'USER_LOGOUT',
                    entity: 'User',
                    entityId: req.user.id,
                    ip: req.ip,
                });
            }
            res.json({ data: { message: 'Logged out successfully' }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            const user = await this.authService.getMe(req.user.id);
            res.json({ data: user, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    async updateProfile(req, body, res, next) {
        try {
            const user = await this.authService.updateProfile(req.user.id, body);
            await (0, audit_1.logAudit)({
                userId: req.user.id,
                action: 'USER_PROFILE_UPDATE',
                entity: 'User',
                entityId: req.user.id,
                ip: req.ip,
            });
            res.json({ data: user, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.FARMER, client_1.Role.BUYER, client_1.Role.DELIVERY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.FARMER, client_1.Role.BUYER, client_1.Role.DELIVERY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.FARMER, client_1.Role.BUYER, client_1.Role.DELIVERY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
