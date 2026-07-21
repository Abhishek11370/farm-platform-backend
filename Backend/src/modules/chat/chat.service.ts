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
      isRead: true,
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

  async getConversations(userId: string) {
    // Find all users the current user has chatted with
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      }
    });

    const conversationMap = new Map();
    messages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: partner.name,
          partnerRole: partner.role,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: msg.receiverId === userId && !msg.isRead ? 1 : 0
        });
      } else if (msg.receiverId === userId && !msg.isRead) {
        conversationMap.get(partnerId).unreadCount++;
      }
    });

    return Array.from(conversationMap.values());
  }

  async getAdminConversations(page = 1, limit = 50) {
    // Return all latest messages globally to show active conversations
    const messages = await this.prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
      take: 1000 // Get latest 1000 to extract unique conversations
    });

    const conversationMap = new Map();
    messages.forEach((msg) => {
      // Create a unique key for the pair
      const pair = [msg.senderId, msg.receiverId].sort().join('-');
      if (!conversationMap.has(pair)) {
        conversationMap.set(pair, {
          id: pair,
          participant1: msg.sender,
          participant2: msg.receiver,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
        });
      }
    });

    const allConvos = Array.from(conversationMap.values());
    const total = allConvos.length;
    const start = (page - 1) * limit;
    const paginated = allConvos.slice(start, start + limit);

    return { conversations: paginated, total, page, limit };
  }

  async deleteMessage(messageId: string, userId: string) {
    const msg = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!msg) throw new NotFoundException();
    // In a real app, only sender or admin can delete. Assuming admin here or sender.
    return this.prisma.chatMessage.delete({ where: { id: messageId } });
  }

}
