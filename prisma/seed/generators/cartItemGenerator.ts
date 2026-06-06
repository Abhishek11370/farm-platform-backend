import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateCartItems = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  // First create carts for some buyers
  for (const buyer of buyers.slice(0, 20)) {
    await prisma.cart.upsert({
      where: { userId: buyer.id },
      update: {},
      create: { id: uuidv4(), userId: buyer.id },
    });
  }
  
  const carts = await prisma.cart.findMany();
  if (carts.length === 0) return;

  const cartItems = [];
  for (let i = 0; i < count; i++) {
    cartItems.push({
      id: uuidv4(),
      cartId: randomFromArray(carts).id,
      productId: randomFromArray(products).id,
      qty: faker.number.float({ min: 1, max: 10 }),
    });
  }
  await prisma.cartItem.createMany({ data: cartItems, skipDuplicates: true });
};
