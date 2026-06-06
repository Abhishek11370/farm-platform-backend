import prisma from '../utils/prisma';

export class ActivityService {
  static async logActivity(userId: string, action: string, entityType: string, entityId?: string) {
    return prisma.activity.create({
      data: {
        userId,
        action,
        entityType,
        entityId
      }
    });
  }

  static async getUserActivities(userId: string) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  static async getAllActivities() {
    return prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });
  }
}
