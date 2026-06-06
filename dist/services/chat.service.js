"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sockets_1 = require("../sockets");
class ChatService {
    static async getMessages(userId, partnerId) {
        return prisma_1.default.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });
    }
    static async sendMessage(senderId, receiverId, content) {
        const message = await prisma_1.default.chatMessage.create({
            data: {
                senderId,
                receiverId,
                content
            }
        });
        // Real-time socket message emit
        (0, sockets_1.sendLiveChatMessage)(receiverId, {
            id: message.id,
            senderId,
            content,
            createdAt: message.createdAt
        });
        return message;
    }
}
exports.ChatService = ChatService;
