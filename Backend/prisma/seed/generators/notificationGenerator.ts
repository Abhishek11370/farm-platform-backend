import { PrismaClient, NotificationType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateNotifications = async (prisma: PrismaClient, count: number = 100) => {
  const users = await prisma.user.findMany();
  if (users.length === 0) return [];

  const notifications = [];
  for (let i = 0; i < count; i++) {
    notifications.push({
      id: uuidv4(),
      userId: randomFromArray(users).id,
      title: faker.lorem.words(3),
      message: faker.lorem.sentence(),
      type: randomFromArray(Object.values(NotificationType)),
      isRead: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
    });
  }
  await prisma.notification.createMany({ data: notifications, skipDuplicates: true });
};
