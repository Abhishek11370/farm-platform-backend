"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class CartService {
    static async getCart(userId) {
        let cart = await prisma_1.default.cart.findUnique({
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
            cart = await prisma_1.default.cart.create({
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
    static async addToCart(userId, productId, qty) {
        const cart = await this.getCart(userId);
        const existing = cart.items.find((i) => i.productId === productId);
        if (existing) {
            return prisma_1.default.cartItem.update({
                where: { id: existing.id },
                data: { qty: existing.qty + Number(qty) }
            });
        }
        else {
            return prisma_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    qty: Number(qty)
                }
            });
        }
    }
    static async updateCartItem(userId, itemId, qty) {
        const item = await prisma_1.default.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });
        if (!item || item.cart.userId !== userId)
            throw new Error('Cart item not found');
        if (qty <= 0) {
            await prisma_1.default.cartItem.delete({ where: { id: itemId } });
            return { success: true };
        }
        return prisma_1.default.cartItem.update({
            where: { id: itemId },
            data: { qty: Number(qty) }
        });
    }
    static async removeCartItem(userId, itemId) {
        const item = await prisma_1.default.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });
        if (!item || item.cart.userId !== userId)
            throw new Error('Cart item not found');
        await prisma_1.default.cartItem.delete({ where: { id: itemId } });
        return { success: true };
    }
}
exports.CartService = CartService;
