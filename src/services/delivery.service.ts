import prisma from '../utils/prisma';
import { broadcastDeliveryLocation } from '../sockets';

export class DeliveryService {
  static async listDeliveries(userId: string, role: string, filters: any) {
    const { status } = filters;
    const where: any = {};

    if (role === 'DELIVERY') {
      where.agentId = userId;
    }

    if (status) {
      where.status = status;
    }

    return prisma.deliveryAssignment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true } },
            items: { include: { product: true } }
          }
        }
      }
    });
  }

  static async assignDelivery(orderId: string, agentId: string, pickupAddr: string) {
    return prisma.deliveryAssignment.update({
      where: { orderId },
      data: {
        agentId,
        pickupAddr,
        status: 'ACCEPTED'
      }
    });
  }

  static async updateDeliveryStatus(deliveryId: string, status: string, userId: string) {
    const delivery = await prisma.deliveryAssignment.findUnique({ where: { id: deliveryId }, include: { order: true } });
    if (!delivery || delivery.agentId !== userId) throw new Error('Delivery assignment not found');

    const updated = await prisma.deliveryAssignment.update({
      where: { id: deliveryId },
      data: { status }
    });

    // If completed, calculate earnings (e.g. flat delivery fee of 50 INR + 5% of order value)
    if (status === 'COMPLETED') {
      const amount = 50 + (delivery.order.totalAmount * 0.05);
      await prisma.deliveryEarning.create({
        data: {
          deliveryId,
          agentId: userId,
          amount
        }
      });
      // Update order status as well
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' }
      });
    }

    return updated;
  }

  static async updateDeliveryLocation(deliveryId: string, lat: number, lng: number, userId: string) {
    const delivery = await prisma.deliveryAssignment.findUnique({ where: { id: deliveryId } });
    if (!delivery || delivery.agentId !== userId) throw new Error('Delivery assignment not found');

    const updated = await prisma.deliveryAssignment.update({
      where: { id: deliveryId },
      data: {
        gpsLat: Number(lat),
        gpsLng: Number(lng)
      }
    });

    // Broadcast live to socket room
    broadcastDeliveryLocation(deliveryId, { deliveryId, lat, lng });

    return updated;
  }

  static async getEarnings(userId: string) {
    const earnings = await prisma.deliveryEarning.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: 'desc' },
      include: { delivery: true }
    });

    const total = earnings.reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      earnings,
      total
    };
  }

  static async getAdminEarnings() {
    const earnings = await prisma.deliveryEarning.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        agent: { select: { id: true, name: true } },
        delivery: true
      }
    });

    const total = earnings.reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      earnings,
      total
    };
  }
}
