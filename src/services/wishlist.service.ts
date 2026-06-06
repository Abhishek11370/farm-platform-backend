import prisma from '../utils/prisma';

export class WishlistService {
  static async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, unit: true }
        }
      }
    });
  }

  static async addToWishlist(userId: string, productId: string) {
    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (existing) return existing;

    return prisma.wishlist.create({
      data: {
        userId,
        productId
      }
    });
  }

  static async removeFromWishlist(userId: string, wishlistId: string) {
    const item = await prisma.wishlist.findUnique({
      where: { id: wishlistId }
    });

    if (!item || item.userId !== userId) throw new Error('Wishlist item not found');

    await prisma.wishlist.delete({ where: { id: wishlistId } });
    return { success: true };
  }
}
