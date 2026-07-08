import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get all notifications for the authenticated user */
  async findMine(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { notifications, total, unreadCount, page, limit };
  }

  /** Mark a single notification as read */
  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  /** Mark all user notifications as read */
  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /** Delete a notification */
  async remove(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.delete({ where: { id } });
  }

  /** Admin: send a notification to a user */
  async create(userId: string, title: string, message: string, type: any) {
    return this.prisma.notification.create({
      data: { userId, title, message, type },
    });
  }

  /** Admin: list all notifications */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, name: true, email: true } } } }),
      this.prisma.notification.count(),
    ]);
    return { notifications, total, page, limit };
  }
}
