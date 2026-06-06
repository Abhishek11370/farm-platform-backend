import { PrismaClient, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateOrders = async (prisma: PrismaClient, count: number = 200) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  if (buyers.length === 0) return [];

  const orders = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      id: uuidv4(),
      buyerId: randomFromArray(buyers).id,
      status: randomFromArray(Object.values(OrderStatus)),
      totalAmount: 0, // will be updated later
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });
  }
  await prisma.order.createMany({ data: orders, skipDuplicates: true });
};
