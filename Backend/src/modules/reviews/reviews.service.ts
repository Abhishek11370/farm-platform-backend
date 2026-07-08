import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Submit a product review */
  async create(buyerId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.review.findFirst({
      where: { productId: dto.productId, buyerId },
    });
    if (existing) throw new ConflictException('You have already reviewed this product');

    return this.prisma.review.create({
      data: { productId: dto.productId, buyerId, rating: dto.rating, comment: dto.comment },
      include: { buyer: { select: { id: true, name: true } } },
    });
  }

  /** Get all reviews for a product */
  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total, avgRating] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { productId },
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { buyer: { select: { id: true, name: true } } },
      }),
      this.prisma.review.count({ where: { productId } }),
      this.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      }),
    ]);
    return { reviews, total, avgRating: avgRating._avg.rating, page, limit };
  }

  /** Get all reviews by the authenticated user */
  async findMine(buyerId: string) {
    return this.prisma.review.findMany({
      where: { buyerId },
      include: { product: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Delete a review (buyer can delete own, admin can delete any) */
  async remove(id: string, userId: string, role: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (role !== 'ADMIN' && review.buyerId !== userId) throw new ForbiddenException('Cannot delete this review');
    return this.prisma.review.delete({ where: { id } });
  }
}
