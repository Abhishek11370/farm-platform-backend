"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const audit_1 = require("../utils/audit");
class PaymentController {
    static async createPaymentOrder(req, res, next) {
        try {
            const { orderId } = req.body;
            const result = await payment_service_1.PaymentService.createPaymentOrder(req.user.id, orderId);
            res.status(201).json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async verifyPayment(req, res, next) {
        try {
            const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
            const payment = await payment_service_1.PaymentService.verifyPayment(req.user.id, orderId, razorpayPaymentId, razorpaySignature);
            await (0, audit_1.logAudit)({
                userId: req.user.id,
                action: 'PAYMENT_VERIFY',
                entity: 'Payment',
                entityId: payment.id,
                payload: { orderId, razorpayPaymentId },
                ip: req.ip
            });
            res.json({ data: payment, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async handleWebhook(req, res, next) {
        try {
            const signature = req.headers['x-razorpay-signature'];
            const result = await payment_service_1.PaymentService.handleWebhook(req.body, signature);
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getPaymentHistory(req, res, next) {
        try {
            const list = await payment_service_1.PaymentService.getPaymentHistory(req.user.id);
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async processRefund(req, res, next) {
        try {
            const { paymentId } = req.body;
            const payment = await payment_service_1.PaymentService.processRefund(paymentId);
            await (0, audit_1.logAudit)({
                userId: req.user.id,
                action: 'PAYMENT_REFUND',
                entity: 'Payment',
                entityId: paymentId,
                ip: req.ip
            });
            res.json({ data: payment, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PaymentController = PaymentController;
