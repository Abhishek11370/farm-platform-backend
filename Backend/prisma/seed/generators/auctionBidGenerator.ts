import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateAuctionBids = async (prisma: PrismaClient, count: number = 250) => {
  const auctions = await prisma.auction.findMany();
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  
  if (auctions.length === 0 || buyers.length === 0) return [];

  const bids = [];
  for (let i = 0; i < count; i++) {
    const auction = randomFromArray(auctions);
    bids.push({
      id: uuidv4(),
      auctionId: auction.id,
      bidderId: randomFromArray(buyers).id,
      amount: auction.basePrice + faker.number.int({ min: 10, max: 500 }),
      createdAt: faker.date.between({ from: auction.startTime, to: auction.endTime }),
    });
  }
  await prisma.bid.createMany({ data: bids, skipDuplicates: true });
};
