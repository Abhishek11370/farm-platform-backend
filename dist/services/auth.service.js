"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
class AuthService {
    static async register(data) {
        const { name, email, phone, password, role } = data;
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email: email ? email.toLowerCase() : null,
                phone: phone || null,
                password: hashed,
                role: role || client_1.Role.BUYER
            }
        });
        const accessToken = (0, auth_1.signAccessToken)(user);
        const refreshToken = (0, auth_1.signRefreshToken)(user);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        };
    }
    static async login(data) {
        const { email, phone, password } = data;
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    email ? { email: email.toLowerCase() } : undefined,
                    phone ? { phone } : undefined
                ].filter(Boolean)
            }
        });
        if (!user)
            throw new Error('Invalid credentials');
        if (user.isBlocked)
            throw new Error('Your account has been blocked');
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            throw new Error('Invalid credentials');
        const accessToken = (0, auth_1.signAccessToken)(user);
        const refreshToken = (0, auth_1.signRefreshToken)(user);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        };
    }
    static async refresh(token) {
        try {
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
            if (!user || user.isBlocked)
                throw new Error('Unauthorized');
            const accessToken = (0, auth_1.signAccessToken)(user);
            const newRefreshToken = (0, auth_1.signRefreshToken)(user);
            return {
                accessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            };
        }
        catch {
            throw new Error('Invalid or expired refresh token');
        }
    }
    static async getMe(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isBlocked: true,
                createdAt: true
            }
        });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    static async updateProfile(id, data) {
        const { name, email, phone, password } = data;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email.toLowerCase();
        if (phone)
            updateData.phone = phone;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }
        });
        return user;
    }
}
exports.AuthService = AuthService;
