import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get the wishlist for the authenticated user */
  async findMine(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, owner: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Add a product to the user's wishlist */
  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    if (existing) throw new ConflictException('Product already in wishlist');

    return this.prisma.wishlist.create({ data: { userId, productId } });
  }

  /** Remove a product from the wishlist */
  async remove(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    if (!item) throw new NotFoundException('Wishlist item not found');
    return this.prisma.wishlist.delete({ where: { id: item.id } });
  }

  /** Check if a product is in the user's wishlist */
  async check(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    return { isWishlisted: !!item };
  }

  /** Clear all wishlist items for the user */
  async clearAll(userId: string) {
    return this.prisma.wishlist.deleteMany({ where: { userId } });
  }
}
