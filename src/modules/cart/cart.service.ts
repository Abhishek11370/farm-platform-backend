import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, unit: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true, unit: true },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, productId: string, qty: number) {
    const cart = await this.getCart(userId);
    const existing = cart.items.find((i: any) => i.productId === productId);

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + Number(qty) },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          qty: Number(qty),
        },
      });
    }
  }

  async updateCartItem(userId: string, itemId: string, qty: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (qty <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
      return { success: true };
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { qty: Number(qty) },
    });
  }

  async removeCartItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { success: true };
  }
}
