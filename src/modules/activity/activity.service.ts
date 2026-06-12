import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(userId: string, action: string, entityType: string, entityId?: string) {
    return this.prisma.activity.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
      },
    });
  }

  async getUserActivities(userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getAllActivities() {
    return this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });
  }
}
