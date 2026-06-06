"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSignature = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("./logger");
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const isConfigured = !!(keyId && keySecret);
let razorpay = null;
if (isConfigured) {
    razorpay = new razorpay_1.default({
        key_id: keyId,
        key_secret: keySecret
    });
    logger_1.logger.info('Razorpay initialized successfully.');
}
else {
    logger_1.logger.warn('Razorpay credentials missing. Payment integrations will run in simulated demo mode.');
}
const createRazorpayOrder = async (amount, receiptId) => {
    const amountInPaise = Math.round(amount * 100);
    if (!isConfigured || !razorpay) {
        logger_1.logger.debug('Simulating Razorpay order creation.');
        return {
            id: `order_sim_${crypto_1.default.randomBytes(8).toString('hex')}`,
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            status: 'created',
            notes: { simulated: true }
        };
    }
    try {
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: { receiptId }
        });
        return order;
    }
    catch (error) {
        logger_1.logger.error('Error creating Razorpay order:', error);
        throw new Error('Payment order creation failed');
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, signature) => {
    if (!isConfigured) {
        logger_1.logger.debug('Skipping signature verification in simulated mode.');
        return true; // Always authorize in simulated mode
    }
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || keySecret || '';
        const shasum = crypto_1.default.createHmac('sha256', webhookSecret);
        shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');
        return digest === signature;
    }
    catch (error) {
        logger_1.logger.error('Signature verification failed:', error);
        return false;
    }
};
exports.verifyPaymentSignature = verifyPaymentSignature;
