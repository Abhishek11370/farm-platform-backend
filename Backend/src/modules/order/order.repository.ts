import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data });
  }

  async findOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async findOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: { items: true },
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status } as any,
    });
  }

  async deleteOrder(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
