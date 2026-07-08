import { PrismaClient, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const generatePayments = async (prisma: PrismaClient) => {
  const orders = await prisma.order.findMany({ where: { totalAmount: { gt: 0 } } });
  if (orders.length === 0) return;

  const payments = [];
  for (const order of orders) {
    // only PAID, CONFIRMED, SHIPPED, DELIVERED have payments mostly
    if (order.status === OrderStatus.PLACED || order.status === OrderStatus.CANCELLED) {
      if (Math.random() > 0.3) continue; // some cancelled orders might have failed payments
    }
    
    payments.push({
      id: uuidv4(),
      orderId: order.id,
      razorpayOrderId: "order_" + faker.string.alphanumeric(14),
      razorpayPaymentId: "pay_" + faker.string.alphanumeric(14),
      status: "CAPTURED",
      amount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: new Date(),
    });
  }
  await prisma.payment.createMany({ data: payments, skipDuplicates: true });
};
