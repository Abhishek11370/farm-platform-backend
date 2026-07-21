import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Validate product exists and fetch price
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    const price = product.price;
    const totalAmount = dto.quantity * price;
    const data = {
      buyer: { connect: { id: dto.userId } },
      totalAmount,
      status: "PLACED" as const,
      // order items will be created after order record
    } as any;
    // Create order first
    const order = await this.orderRepo.createOrder(data);
    // Create order item linked to order
    await this.prisma.orderItem.create({
      data: {
        order: { connect: { id: order.id } },
        product: { connect: { id: dto.productId } },
        qty: dto.quantity,
        price,
      },
    });
    return order;
  }

  async findAllAdmin() {
    return this.orderRepo.findAllOrders();
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOrderById(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async findByUser(userId: string) {
    return this.orderRepo.findOrdersByUser(userId);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    // Simple status transition validation could be added here
    return this.orderRepo.updateOrderStatus(id, dto.status as any);
  }

  async remove(id: string) {
    // Potentially check status before deletion
    return this.orderRepo.deleteOrder(id);
  }

  async getFarmerOrders(farmerId: string, query: any) {
    // Requires prisma update for actual filtering, mock for now to satisfy endpoint
    return [];
  }

  async getFarmerOrderStats(farmerId: string) {
    return { total: 0, pending: 0, completed: 0 };
  }

  async updateOrderDetails(id: string, userId: string, dto: any) {
    return this.prisma.order.update({where: {id}, data: {status: dto.status as any}});
  }

}
