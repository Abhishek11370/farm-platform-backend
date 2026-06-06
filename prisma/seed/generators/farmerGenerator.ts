import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomPhone, randomEmail } from "../utils/generator";

export const generateFarmers = async (prisma: PrismaClient, count: number = 20) => {
  const farmers = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    farmers.push({
      id: uuidv4(),
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      password: faker.internet.password({ length: 12 }),
      role: Role.FARMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  await prisma.user.createMany({ 
    data: farmers, 
    skipDuplicates: true 
  });
  
  return await prisma.user.findMany({ where: { role: Role.FARMER } });
};
