import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { broadcastDeliveryLocation } from '../../sockets';
import { DeliveryQueryDto } from './dto/delivery-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  private get deliverySelect() {
    return {
      id: true,
      orderId: true,
      agentId: true,
      pickupAddr: true,
      dropAddr: true,
      status: true,
      gpsLat: true,
      gpsLng: true,
      updatedAt: true,
      order: {
        select: {
          id: true,
          buyerId: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          buyer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            }
          },
          items: {
            select: {
              id: true,
              productId: true,
              qty: true,
              price: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  ownerId: true,
                }
              }
            }
          }
        }
      }
    };
  }

  async listDeliveries(userId: string, role: string, filters: DeliveryQueryDto) {
    const { status } = filters;
    const where: Prisma.DeliveryAssignmentWhereInput = {};

    if (role === 'DELIVERY') {
      where.agentId = userId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.deliveryAssignment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: this.deliverySelect,
    });
  }

  async assignDelivery(orderId: string, agentId: string, pickupAddr: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const agent = await this.prisma.user.findUnique({ where: { id: agentId } });
    if (!agent || agent.role !== 'DELIVERY') {
      throw new BadRequestException('Invalid delivery agent');
    }

    // Verify existing assignment status
    const existing = await this.prisma.deliveryAssignment.findUnique({ where: { orderId } });
    if (existing && existing.status !== 'PENDING' && existing.status !== 'CANCELLED') {
      throw new BadRequestException(`Delivery assignment is already in ${existing.status} status`);
    }

    if (existing) {
      return this.prisma.deliveryAssignment.update({
        where: { orderId },
        data: {
          agentId,
          pickupAddr,
          status: 'ASSIGNED',
        },
        select: {
          id: true,
          orderId: true,
          agentId: true,
          status: true,
        }
      });
    }

    return this.prisma.deliveryAssignment.create({
      data: {
        orderId,
        agentId,
        pickupAddr,
        status: 'ASSIGNED',
      },
      select: {
        id: true,
        orderId: true,
        agentId: true,
        status: true,
      }
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

    const validTransitions: Record<string, string[]> = {
      'PENDING': ['ASSIGNED'],
      'ASSIGNED': ['IN_TRANSIT'],
      'IN_TRANSIT': ['DELIVERED'],
      'DELIVERED': []
    };

    const currentStatus = delivery.status;
    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(status) && status !== currentStatus) {
      throw new BadRequestException(`Invalid transition from ${currentStatus} to ${status}`);
    }

    const updated = await this.prisma.deliveryAssignment.update({
      where: { id: deliveryId },
      data: { status },
      select: {
        id: true,
        orderId: true,
        agentId: true,
        status: true,
      }
    });

    if (status === 'DELIVERED') {
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
      select: {
        id: true,
        gpsLat: true,
        gpsLng: true,
        status: true,
      }
    });

    broadcastDeliveryLocation(deliveryId, { deliveryId, lat, lng });

    return updated;
  }

  async getEarnings(userId: string) {
    const earnings = await this.prisma.deliveryEarning.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        deliveryId: true,
        agentId: true,
        amount: true,
        createdAt: true,
        delivery: {
          select: {
            id: true,
            orderId: true,
            status: true,
          }
        }
      }
    });

    const total = earnings.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    return {
      earnings,
      total,
    };
  }

  async getAdminEarnings() {
    const earnings = await this.prisma.deliveryEarning.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        deliveryId: true,
        agentId: true,
        amount: true,
        createdAt: true,
        agent: {
          select: {
            id: true,
            name: true,
          }
        },
        delivery: {
          select: {
            id: true,
            orderId: true,
            status: true,
          }
        }
      }
    });

    const total = earnings.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    return {
      earnings,
      total,
    };
  }
}
