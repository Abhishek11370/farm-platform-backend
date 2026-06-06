import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomPhone, randomEmail } from "../utils/generator";

export const generateBuyers = async (prisma: PrismaClient, count: number = 20) => {
  const buyers = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    buyers.push({
      id: uuidv4(),
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      password: faker.internet.password({ length: 12 }),
      role: Role.BUYER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await prisma.user.createMany({ data: buyers, skipDuplicates: true });
  return await prisma.user.findMany({ where: { role: Role.BUYER } });
};
