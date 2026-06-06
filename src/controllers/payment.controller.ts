import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { logAudit } from '../utils/audit';

export class PaymentController {
  static async createPaymentOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const result = await PaymentService.createPaymentOrder(req.user!.id, orderId);
      res.status(201).json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
      const payment = await PaymentService.verifyPayment(
        req.user!.id,
        orderId,
        razorpayPaymentId,
        razorpaySignature
      );
      await logAudit({
        userId: req.user!.id,
        action: 'PAYMENT_VERIFY',
        entity: 'Payment',
        entityId: payment.id,
        payload: { orderId, razorpayPaymentId },
        ip: req.ip
      });
      res.json({ data: payment, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const result = await PaymentService.handleWebhook(req.body, signature);
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getPaymentHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await PaymentService.getPaymentHistory(req.user!.id);
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async processRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.body;
      const payment = await PaymentService.processRefund(paymentId);
      await logAudit({
        userId: req.user!.id,
        action: 'PAYMENT_REFUND',
        entity: 'Payment',
        entityId: paymentId,
        ip: req.ip
      });
      res.json({ data: payment, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
