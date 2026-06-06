import prisma from '../utils/prisma';

export class ReviewService {
  static async createReview(buyerId: string, data: any) {
    const { productId, rating, comment } = data;

    // Check if buyer has ordered the product first (optional verification, standard logic)
    const order = await prisma.order.findFirst({
      where: {
        buyerId,
        status: 'DELIVERED',
        items: {
          some: { productId }
        }
      }
    });

    if (!order) {
      throw new Error('You can only review products that have been delivered to you.');
    }

    return prisma.review.create({
      data: {
        buyerId,
        productId,
        rating: Number(rating),
        comment
      }
    });
  }

  static async getProductReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { id: true, name: true } }
      }
    });
  }

  static async updateReview(reviewId: string, buyerId: string, userRole: string, data: any) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error('Review not found');

    if (review.buyerId !== buyerId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const { rating, comment } = data;

    return prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating ? Number(rating) : undefined,
        comment
      }
    });
  }

  static async deleteReview(reviewId: string, buyerId: string, userRole: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error('Review not found');

    if (review.buyerId !== buyerId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return { success: true };
  }
}
