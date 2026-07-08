import { PrismaClient, AuctionStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateAuctions = async (prisma: PrismaClient, count: number = 50) => {
  const products = await prisma.product.findMany();
  if (products.length === 0) return [];

  const auctions = [];
  for (let i = 0; i < count; i++) {
    const product = randomFromArray(products);
    const startTime = faker.date.recent();
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + faker.number.int({ min: 1, max: 7 }));

    auctions.push({
      id: uuidv4(),
      productId: product.id,
      startTime,
      endTime,
      basePrice: product.price,
      status: randomFromArray(Object.values(AuctionStatus)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await prisma.auction.createMany({ data: auctions, skipDuplicates: true });
};
