"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const verification_controller_1 = require("../controllers/verification.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const submitSchema = zod_1.z.object({
    body: zod_1.z.object({
        documentUrl: zod_1.z.string(),
        documentType: zod_1.z.string()
    })
});
const reviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.VerificationStatus)
    })
});
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER), (0, validate_1.validate)(submitSchema), verification_controller_1.VerificationController.submitVerification);
router.get('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER), verification_controller_1.VerificationController.getFarmerVerifications);
router.get('/admin', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), verification_controller_1.VerificationController.getAllVerifications);
router.patch('/:id/review', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(reviewSchema), verification_controller_1.VerificationController.reviewVerification);
exports.default = router;
