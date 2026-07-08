import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateChatMessages = async (prisma: PrismaClient, count: number = 300) => {
  const users = await prisma.user.findMany();
  if (users.length < 2) return [];

  const messages = [];
  for (let i = 0; i < count; i++) {
    const sender = randomFromArray(users);
    let receiver = randomFromArray(users);
    while (receiver.id === sender.id) {
      receiver = randomFromArray(users);
    }
    messages.push({
      id: uuidv4(),
      senderId: sender.id,
      receiverId: receiver.id,
      content: faker.lorem.sentences(2),
      createdAt: faker.date.recent(),
    });
  }
  await prisma.chatMessage.createMany({ data: messages, skipDuplicates: true });
};
