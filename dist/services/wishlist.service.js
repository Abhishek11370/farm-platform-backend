"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class WishlistService {
    static async getWishlist(userId) {
        return prisma_1.default.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    include: { images: true, unit: true }
                }
            }
        });
    }
    static async addToWishlist(userId, productId) {
        // Check if already in wishlist
        const existing = await prisma_1.default.wishlist.findFirst({
            where: { userId, productId }
        });
        if (existing)
            return existing;
        return prisma_1.default.wishlist.create({
            data: {
                userId,
                productId
            }
        });
    }
    static async removeFromWishlist(userId, wishlistId) {
        const item = await prisma_1.default.wishlist.findUnique({
            where: { id: wishlistId }
        });
        if (!item || item.userId !== userId)
            throw new Error('Wishlist item not found');
        await prisma_1.default.wishlist.delete({ where: { id: wishlistId } });
        return { success: true };
    }
}
exports.WishlistService = WishlistService;
