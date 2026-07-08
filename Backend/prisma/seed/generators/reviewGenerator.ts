import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateReviews = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: uuidv4(),
      productId: randomFromArray(products).id,
      buyerId: randomFromArray(buyers).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
    });
  }
  await prisma.review.createMany({ data: reviews, skipDuplicates: true });
};
