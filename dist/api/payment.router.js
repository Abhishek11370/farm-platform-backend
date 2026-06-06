"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const payment_controller_1 = require("../controllers/payment.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string()
    })
});
const verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string(),
        razorpayPaymentId: zod_1.z.string(),
        razorpaySignature: zod_1.z.string()
    })
});
const refundSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string()
    })
});
router.post('/create-order', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(createOrderSchema), payment_controller_1.PaymentController.createPaymentOrder);
router.post('/verify', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(verifyPaymentSchema), payment_controller_1.PaymentController.verifyPayment);
router.post('/webhook', payment_controller_1.PaymentController.handleWebhook);
router.get('/history', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), payment_controller_1.PaymentController.getPaymentHistory);
router.post('/refund', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(refundSchema), payment_controller_1.PaymentController.processRefund);
exports.default = router;
