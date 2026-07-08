import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateWishlistItems = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  const wishlistItems = [];
  for (let i = 0; i < count; i++) {
    wishlistItems.push({
      id: uuidv4(),
      userId: randomFromArray(buyers).id,
      productId: randomFromArray(products).id,
      createdAt: new Date(),
    });
  }
  await prisma.wishlist.createMany({ data: wishlistItems, skipDuplicates: true });
};
