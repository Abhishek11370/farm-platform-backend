import prisma from '../utils/prisma';

export class CartService {
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, unit: true }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true, unit: true }
              }
            }
          }
        }
      });
    }

    return cart;
  }

  static async addToCart(userId: string, productId: string, qty: number) {
    const cart = await this.getCart(userId);
    const existing = cart.items.find((i: any) => i.productId === productId);

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + Number(qty) }
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          qty: Number(qty)
        }
      });
    }
  }

  static async updateCartItem(userId: string, itemId: string, qty: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!item || item.cart.userId !== userId) throw new Error('Cart item not found');

    if (qty <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return { success: true };
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { qty: Number(qty) }
    });
  }

  static async removeCartItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!item || item.cart.userId !== userId) throw new Error('Cart item not found');

    await prisma.cartItem.delete({ where: { id: itemId } });
    return { success: true };
  }
}
