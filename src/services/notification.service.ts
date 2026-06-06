import prisma from '../utils/prisma';
import { notifyUser } from '../sockets';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== userId) throw new Error('Notification not found');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  static async createNotification(userId: string, title: string, message: string, type: NotificationType) {
    const notif = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });

    // Real-time emit
    notifyUser(userId, {
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      createdAt: notif.createdAt
    });

    return notif;
  }
}
