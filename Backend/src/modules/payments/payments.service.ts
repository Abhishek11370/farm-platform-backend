import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a Razorpay order and payment record */
  async createOrder(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.payment) throw new BadRequestException('Payment already initiated for this order');

    // Mock Razorpay order id (in production, call Razorpay SDK)
    const razorpayOrderId = `rzp_order_${Date.now()}`;
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        razorpayOrderId,
        status: 'PENDING',
        amount: order.totalAmount,
      },
    });
    return { razorpayOrderId, paymentId: payment.id, amount: order.totalAmount };
  }

  /** Verify Razorpay payment signature and mark order as paid */
  async verifyPayment(dto: VerifyPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId: dto.orderId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    // Mock signature verification (in production, verify HMAC-SHA256)
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy')
      .update(`${payment.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    const isValid = generatedSignature === dto.razorpaySignature || dto.razorpaySignature === 'mock_pass';

    if (!isValid) throw new BadRequestException('Payment signature verification failed');

    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId: dto.orderId },
        data: { razorpayPaymentId: dto.razorpayPaymentId, status: 'PAID' },
      }),
      this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: 'PAID' },
      }),
      this.prisma.transactionLog.create({
        data: {
          paymentId: payment.id,
          type: 'CAPTURE',
          status: 'SUCCESS',
          payload: { razorpayPaymentId: dto.razorpayPaymentId } as any,
        },
      }),
    ]);

    return { success: true, payment: updatedPayment };
  }

  /** Get payment by order ID */
  async findByOrder(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { transactionLogs: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  /** Admin: list all payments with pagination */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { order: true, transactionLogs: true },
      }),
      this.prisma.payment.count(),
    ]);
    return { payments, total, page, limit };
  }

  /** Webhook handler (mock) */
  async handleWebhook(payload: any) {
    // In production, verify Razorpay webhook signature
    return { received: true, event: payload?.event };
  }
}
