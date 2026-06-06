import prisma from '../utils/prisma';
import { createRazorpayOrder, verifyPaymentSignature } from '../utils/razorpay';
import { logger } from '../utils/logger';

export class PaymentService {
  static async createPaymentOrder(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    if (order.buyerId !== userId) throw new Error('Unauthorized');

    // Create Razorpay Order
    const rOrder = await createRazorpayOrder(order.totalAmount, orderId);

    // Store Payment Entry in DB
    const payment = await prisma.payment.upsert({
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
    await prisma.transactionLog.create({
      data: {
        paymentId: payment.id,
        type: 'ORDER_CREATE',
        status: 'SUCCESS',
        payload: rOrder as any
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

  static async verifyPayment(
    userId: string,
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new Error('Payment record not found');

    const isValid = verifyPaymentSignature(
      payment.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'FAILED' }
      });
      await prisma.transactionLog.create({
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
    const updatedPayment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'CAPTURED',
        razorpayPaymentId
      }
    });

    // Update Order Status to PAID
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    });

    // Log transaction
    await prisma.transactionLog.create({
      data: {
        paymentId: payment.id,
        type: 'VERIFICATION',
        status: 'SUCCESS',
        payload: { razorpayPaymentId }
      }
    });

    return updatedPayment;
  }

  static async handleWebhook(payload: any, signature: string) {
    logger.info('Razorpay webhook received:', payload);
    const event = payload.event;

    if (event === 'payment.captured') {
      const { order_id, id: payment_id } = payload.payload.payment.entity;
      const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: order_id } });

      if (payment && payment.status !== 'CAPTURED') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'CAPTURED', razorpayPaymentId: payment_id }
        });
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' }
        });
        await prisma.transactionLog.create({
          data: {
            paymentId: payment.id,
            type: 'WEBHOOK_CAPTURE',
            status: 'SUCCESS',
            payload
          }
        });
      }
    } else if (event === 'payment.failed') {
      const { order_id } = payload.payload.payment.entity;
      const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: order_id } });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' }
        });
        await prisma.transactionLog.create({
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

  static async getPaymentHistory(userId: string) {
    return prisma.payment.findMany({
      where: {
        order: { buyerId: userId }
      },
      orderBy: { createdAt: 'desc' },
      include: { order: true }
    });
  }

  static async processRefund(paymentId: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new Error('Payment not found');

    // Simulate/perform refund API call
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' }
    });

    await prisma.transactionLog.create({
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
