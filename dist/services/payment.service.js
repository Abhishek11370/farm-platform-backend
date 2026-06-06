"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const razorpay_1 = require("../utils/razorpay");
const logger_1 = require("../utils/logger");
class PaymentService {
    static async createPaymentOrder(userId, orderId) {
        const order = await prisma_1.default.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error('Order not found');
        if (order.buyerId !== userId)
            throw new Error('Unauthorized');
        // Create Razorpay Order
        const rOrder = await (0, razorpay_1.createRazorpayOrder)(order.totalAmount, orderId);
        // Store Payment Entry in DB
        const payment = await prisma_1.default.payment.upsert({
            where: { orderId },
            update: {
                razorpayOrderId: rOrder.id,
                status: 'CREATED',
                amount: order.totalAmount
            },
            create: {
                orderId,
                razorpayOrderId: rOrder.id,
                status: 'CREATED',
                amount: order.totalAmount
            }
        });
        // Create Transaction Log
        await prisma_1.default.transactionLog.create({
            data: {
                paymentId: payment.id,
                type: 'ORDER_CREATE',
                status: 'SUCCESS',
                payload: rOrder
            }
        });
        return {
            paymentId: payment.id,
            razorpayOrderId: rOrder.id,
            amount: rOrder.amount,
            currency: 'INR',
            orderId: order.id
        };
    }
    static async verifyPayment(userId, orderId, razorpayPaymentId, razorpaySignature) {
        const payment = await prisma_1.default.payment.findUnique({ where: { orderId } });
        if (!payment)
            throw new Error('Payment record not found');
        const isValid = (0, razorpay_1.verifyPaymentSignature)(payment.razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) {
            await prisma_1.default.payment.update({
                where: { orderId },
                data: { status: 'FAILED' }
            });
            await prisma_1.default.transactionLog.create({
                data: {
                    paymentId: payment.id,
                    type: 'VERIFICATION',
                    status: 'FAILED',
                    payload: { razorpayPaymentId, error: 'Signature mismatch' }
                }
            });
            throw new Error('Payment signature verification failed');
        }
        // Update payment as CAPTURED (successful)
        const updatedPayment = await prisma_1.default.payment.update({
            where: { orderId },
            data: {
                status: 'CAPTURED',
                razorpayPaymentId
            }
        });
        // Update Order Status to PAID
        await prisma_1.default.order.update({
            where: { id: orderId },
            data: { status: 'PAID' }
        });
        // Log transaction
        await prisma_1.default.transactionLog.create({
            data: {
                paymentId: payment.id,
                type: 'VERIFICATION',
                status: 'SUCCESS',
                payload: { razorpayPaymentId }
            }
        });
        return updatedPayment;
    }
    static async handleWebhook(payload, signature) {
        logger_1.logger.info('Razorpay webhook received:', payload);
        const event = payload.event;
        if (event === 'payment.captured') {
            const { order_id, id: payment_id } = payload.payload.payment.entity;
            const payment = await prisma_1.default.payment.findFirst({ where: { razorpayOrderId: order_id } });
            if (payment && payment.status !== 'CAPTURED') {
                await prisma_1.default.payment.update({
                    where: { id: payment.id },
                    data: { status: 'CAPTURED', razorpayPaymentId: payment_id }
                });
                await prisma_1.default.order.update({
                    where: { id: payment.orderId },
                    data: { status: 'PAID' }
                });
                await prisma_1.default.transactionLog.create({
                    data: {
                        paymentId: payment.id,
                        type: 'WEBHOOK_CAPTURE',
                        status: 'SUCCESS',
                        payload
                    }
                });
            }
        }
        else if (event === 'payment.failed') {
            const { order_id } = payload.payload.payment.entity;
            const payment = await prisma_1.default.payment.findFirst({ where: { razorpayOrderId: order_id } });
            if (payment) {
                await prisma_1.default.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' }
                });
                await prisma_1.default.transactionLog.create({
                    data: {
                        paymentId: payment.id,
                        type: 'WEBHOOK_FAILURE',
                        status: 'FAILED',
                        payload
                    }
                });
            }
        }
        return { success: true };
    }
    static async getPaymentHistory(userId) {
        return prisma_1.default.payment.findMany({
            where: {
                order: { buyerId: userId }
            },
            orderBy: { createdAt: 'desc' },
            include: { order: true }
        });
    }
    static async processRefund(paymentId) {
        const payment = await prisma_1.default.payment.findUnique({ where: { id: paymentId } });
        if (!payment)
            throw new Error('Payment not found');
        // Simulate/perform refund API call
        const updatedPayment = await prisma_1.default.payment.update({
            where: { id: paymentId },
            data: { status: 'REFUNDED' }
        });
        await prisma_1.default.transactionLog.create({
            data: {
                paymentId,
                type: 'REFUND',
                status: 'SUCCESS',
                payload: { refundedAt: new Date().toISOString() }
            }
        });
        return updatedPayment;
    }
}
exports.PaymentService = PaymentService;
