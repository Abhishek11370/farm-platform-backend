import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { broadcastDeliveryLocation } from '../../sockets';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async listDeliveries(userId: string, role: string, filters: any) {
    const { status } = filters;
    const where: any = {};

    if (role === 'DELIVERY') {
      where.agentId = userId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.deliveryAssignment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true } },
            items: { include: { product: true } },
          },
        },
      },
    });
  }

  async assignDelivery(orderId: string, agentId: string, pickupAddr: string) {
    return this.prisma.deliveryAssignment.update({
      where: { orderId },
      data: {
        agentId,
        pickupAddr,
        status: 'ACCEPTED',
      },
    });
  }

  async updateDeliveryStatus(deliveryId: string, status: string, userId: string) {
    const delivery = await this.prisma.deliveryAssignment.findUnique({
      where: { id: deliveryId },
      include: { order: true },
    });
    if (!delivery || delivery.agentId !== userId) {
      throw new NotFoundException('Delivery assignment not found');
    }

    const updated = await this.prisma.deliveryAssignment.update({
      where: { id: deliveryId },
      data: { status },
    });

    if (status === 'COMPLETED') {
      const amount = 50 + delivery.order.totalAmount * 0.05;
      await this.prisma.deliveryEarning.create({
        data: {
          deliveryId,
          agentId: userId,
          amount,
        },
      });
      await this.prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    return updated;
  }

  async updateDeliveryLocation(deliveryId: string, lat: number, lng: number, userId: string) {
    const delivery = await this.prisma.deliveryAssignment.findUnique({ where: { id: deliveryId } });
    if (!delivery || delivery.agentId !== userId) {
      throw new NotFoundException('Delivery assignment not found');
    }

    const updated = await this.prisma.deliveryAssignment.update({
      where: { id: deliveryId },
      data: {
        gpsLat: Number(lat),
        gpsLng: Number(lng),
      },
    });

    broadcastDeliveryLocation(deliveryId, { deliveryId, lat, lng });

    return updated;
  }

  async getEarnings(userId: string) {
    const earnings = await this.prisma.deliveryEarning.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: 'desc' },
      include: { delivery: true },
    });

    const total = earnings.reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      earnings,
      total,
    };
  }

  async getAdminEarnings() {
    const earnings = await this.prisma.deliveryEarning.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        agent: { select: { id: true, name: true } },
        delivery: true,
      },
    });

    const total = earnings.reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      earnings,
      total,
    };
  }
}
