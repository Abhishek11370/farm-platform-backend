import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { sendLiveChatMessage } from "../../sockets";
import { ChatQueryDto } from "./dto/chat-query.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private get messageSelect() {
    return {
      id: true,
      senderId: true,
      receiverId: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };
  }

  async getMessages(userId: string, partnerId: string, filters: ChatQueryDto) {
    const { page = 1, limit = 50 } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const partner = await this.prisma.user.findUnique({
      where: { id: partnerId },
    });
    if (!partner) {
      throw new NotFoundException("Chat partner user not found");
    }

    const where: Prisma.ChatMessageWhereInput = {
      OR: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    };

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        select: this.messageSelect,
      }),
      this.prisma.chatMessage.count({ where }),
    ]);

    // Reverse list back to ascending chronology
    return {
      messages: messages.reverse(),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    if (!content || content.trim().length === 0) {
      throw new BadRequestException("Message content cannot be empty");
    }

    if (senderId === receiverId) {
      throw new BadRequestException("Cannot send message to yourself");
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      throw new NotFoundException("Receiver user not found");
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content: content.trim(),
      },
      select: this.messageSelect,
    });

    sendLiveChatMessage(receiverId, {
      id: message.id,
      senderId,
      content: message.content,
      createdAt: message.createdAt,
    });

    return message;
  }
}
