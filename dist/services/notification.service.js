"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sockets_1 = require("../sockets");
class NotificationService {
    static async getNotifications(userId) {
        return prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async markAsRead(notificationId, userId) {
        const notif = await prisma_1.default.notification.findUnique({ where: { id: notificationId } });
        if (!notif || notif.userId !== userId)
            throw new Error('Notification not found');
        return prisma_1.default.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }
    static async createNotification(userId, title, message, type) {
        const notif = await prisma_1.default.notification.create({
            data: {
                userId,
                title,
                message,
                type
            }
        });
        // Real-time emit
        (0, sockets_1.notifyUser)(userId, {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            createdAt: notif.createdAt
        });
        return notif;
    }
}
exports.NotificationService = NotificationService;
