"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class ReviewService {
    static async createReview(buyerId, data) {
        const { productId, rating, comment } = data;
        // Check if buyer has ordered the product first (optional verification, standard logic)
        const order = await prisma_1.default.order.findFirst({
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
        return prisma_1.default.review.create({
            data: {
                buyerId,
                productId,
                rating: Number(rating),
                comment
            }
        });
    }
    static async getProductReviews(productId) {
        return prisma_1.default.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: {
                buyer: { select: { id: true, name: true } }
            }
        });
    }
    static async updateReview(reviewId, buyerId, userRole, data) {
        const review = await prisma_1.default.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new Error('Review not found');
        if (review.buyerId !== buyerId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        const { rating, comment } = data;
        return prisma_1.default.review.update({
            where: { id: reviewId },
            data: {
                rating: rating ? Number(rating) : undefined,
                comment
            }
        });
    }
    static async deleteReview(reviewId, buyerId, userRole) {
        const review = await prisma_1.default.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new Error('Review not found');
        if (review.buyerId !== buyerId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        await prisma_1.default.review.delete({ where: { id: reviewId } });
        return { success: true };
    }
}
exports.ReviewService = ReviewService;
