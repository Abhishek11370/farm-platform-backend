import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { sendLiveChatMessage } from '../../sockets';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(userId: string, partnerId: string) {
    return this.prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await this.prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    sendLiveChatMessage(receiverId, {
      id: message.id,
      senderId,
      content,
      createdAt: message.createdAt,
    });

    return message;
  }
}
