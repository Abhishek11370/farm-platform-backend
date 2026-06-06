import prisma from '../utils/prisma';
import { sendLiveChatMessage } from '../sockets';

export class ChatService {
  static async getMessages(userId: string, partnerId: string) {
    return prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content
      }
    });

    // Real-time socket message emit
    sendLiveChatMessage(receiverId, {
      id: message.id,
      senderId,
      content,
      createdAt: message.createdAt
    });

    return message;
  }
}
