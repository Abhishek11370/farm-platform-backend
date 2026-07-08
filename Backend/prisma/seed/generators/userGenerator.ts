import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomPhone, randomEmail } from "../utils/generator";

export const generateUsers = async (prisma: PrismaClient, count: number = 40) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    users.push({
      id: uuidv4(),
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      password: faker.internet.password({ length: 12 }),
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  await prisma.user.createMany({ 
    data: users, 
    skipDuplicates: true 
  });
  
  const created = await prisma.user.findMany({
    where: { role: Role.ADMIN }
  });
  return created;
};
