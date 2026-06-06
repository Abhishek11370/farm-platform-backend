"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
        phone: zod_1.z.string().optional().or(zod_1.z.literal('')),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.nativeEnum(client_1.Role).optional()
    })
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string()
    }).refine(data => data.email || data.phone, {
        message: 'Either email or phone must be provided'
    })
});
const updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string().min(6).optional()
    })
});
router.post('/register', (0, validate_1.validate)(registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validate_1.validate)(loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', auth_controller_1.AuthController.refresh);
router.post('/logout', auth_1.auth, auth_controller_1.AuthController.logout);
router.get('/me', auth_1.auth, auth_controller_1.AuthController.getMe);
router.patch('/profile', auth_1.auth, (0, validate_1.validate)(updateProfileSchema), auth_controller_1.AuthController.updateProfile);
exports.default = router;
