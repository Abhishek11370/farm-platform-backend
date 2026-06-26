import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private get cartSelect() {
    return {
      id: true,
      userId: true,
      items: {
        select: {
          id: true,
          cartId: true,
          productId: true,
          qty: true,
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              quantity: true,
              latitude: true,
              longitude: true,
              createdAt: true,
              updatedAt: true,
              ownerId: true,
              unit: { select: { id: true, name: true } },
              grade: { select: { id: true, name: true } },
              images: { select: { id: true, imageUrl: true, isPrimary: true } }
            }
          }
        }
      }
    };
  }

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      select: this.cartSelect,
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        select: this.cartSelect,
      });
    }

    return cart;
  }

  async addToCart(userId: string, productId: string, qty: number) {
    if (qty <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getCart(userId);
    const existing = cart.items.find((i) => i.productId === productId);

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + Number(qty) },
        select: {
          id: true,
          cartId: true,
          productId: true,
          qty: true,
        }
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          qty: Number(qty),
        },
        select: {
          id: true,
          cartId: true,
          productId: true,
          qty: true,
        }
      });
    }
  }

  async updateCartItem(userId: string, itemId: string, qty: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        qty: true,
        cart: { select: { userId: true } }
      },
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
      select: {
        id: true,
        cartId: true,
        productId: true,
        qty: true,
      }
    });
  }

  async removeCartItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        cart: { select: { userId: true } }
      },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { success: true };
  }
}
