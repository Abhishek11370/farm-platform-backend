import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { CITIES } from "../constants/cities";
import { randomFromArray } from "../utils/generator";

export const generateAddresses = async (prisma: PrismaClient, count: number = 40) => {
  const users = await prisma.user.findMany();
  if (users.length === 0) return [];

  const addresses = [];
  for (let i = 0; i < count; i++) {
    const user = randomFromArray(users);
    addresses.push({
      id: uuidv4(),
      userId: user.id,
      fullName: user.name,
      phone: user.phone || faker.phone.number(),
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
      city: randomFromArray(CITIES),
      state: "Gujarat",
      pincode: faker.location.zipCode("######"),
      isDefault: i % 2 === 0,
      createdAt: new Date(),
    });
  }
  await prisma.address.createMany({ data: addresses, skipDuplicates: true });
  return await prisma.address.findMany();
};
