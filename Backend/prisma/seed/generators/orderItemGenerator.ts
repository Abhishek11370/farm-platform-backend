import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateOrderItems = async (prisma: PrismaClient, count: number = 250) => {
  const orders = await prisma.order.findMany();
  const products = await prisma.product.findMany();
  
  if (orders.length === 0 || products.length === 0) return [];

  const orderItems = [];
  for (let i = 0; i < count; i++) {
    const product = randomFromArray(products);
    orderItems.push({
      id: uuidv4(),
      orderId: randomFromArray(orders).id,
      productId: product.id,
      qty: faker.number.float({ min: 1, max: 20 }),
      price: product.price,
    });
  }
  await prisma.orderItem.createMany({ data: orderItems, skipDuplicates: true });

  // Update order totals
  for (const order of orders) {
    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    if (total > 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: total },
      });
    }
  }
};
