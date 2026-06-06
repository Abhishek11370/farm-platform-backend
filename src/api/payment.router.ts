import { Router } from 'express';
import { z } from 'zod';
import { PaymentController } from '../controllers/payment.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    orderId: z.string()
  })
});

const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string()
  })
});

const refundSchema = z.object({
  body: z.object({
    paymentId: z.string()
  })
});

router.post('/create-order', auth, allow(Role.BUYER), validate(createOrderSchema), PaymentController.createPaymentOrder);
router.post('/verify', auth, allow(Role.BUYER), validate(verifyPaymentSchema), PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);
router.get('/history', auth, allow(Role.BUYER), PaymentController.getPaymentHistory);
router.post('/refund', auth, allow(Role.ADMIN), validate(refundSchema), PaymentController.processRefund);

export default router;
