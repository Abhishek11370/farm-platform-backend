"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sockets_1 = require("../sockets");
const client_1 = require("@prisma/client");
class OrderService {
    static async createOrder(buyerId, data) {
        const { items, addressId, couponCode } = data;
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Items list cannot be empty');
        }
        const products = await prisma_1.default.product.findMany({
            where: { id: { in: items.map((i) => i.productId) } }
        });
        let total = 0;
        const orderItemsData = items.map(item => {
            const prod = products.find((p) => p.id === item.productId);
            if (!prod)
                throw new Error(`Product not found: ${item.productId}`);
            if (prod.quantity < item.qty) {
                throw new Error(`Insufficient stock for product ${prod.title}`);
            }
            const itemPrice = prod.price;
            total += itemPrice * item.qty;
            return {
                productId: item.productId,
                qty: item.qty,
                price: itemPrice
            };
        });
        // Apply coupon if provided
        let finalAmount = total;
        if (couponCode) {
            const coupon = await prisma_1.default.coupon.findUnique({ where: { code: couponCode } });
            if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date()) {
                if (coupon.discountType === 'PERCENTAGE') {
                    finalAmount = total - (total * coupon.discountValue) / 100;
                }
                else {
                    finalAmount = Math.max(0, total - coupon.discountValue);
                }
            }
        }
        // Resolve shipping address
        const address = await prisma_1.default.address.findUnique({ where: { id: addressId } });
        if (!address)
            throw new Error('Valid shipping address is required');
        const dropAddressStr = `${address.fullName}, ${address.phone}, ${address.addressLine1}, ${address.addressLine2 || ''}, ${address.city}, ${address.state} - ${address.pincode}`;
        // Create Order within a transaction
        const order = await prisma_1.default.$transaction(async (tx) => {
            // Deduct product quantities
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { decrement: item.qty } }
                });
            }
            // Create order
            const o = await tx.order.create({
                data: {
                    buyerId,
                    status: client_1.OrderStatus.PLACED,
                    totalAmount: finalAmount,
                    couponCode,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });
            // Create empty Delivery Assignment
            await tx.deliveryAssignment.create({
                data: {
                    orderId: o.id,
                    status: 'PENDING',
                    dropAddr: dropAddressStr
                }
            });
            // Clear Cart
            const cart = await tx.cart.findUnique({ where: { userId: buyerId } });
            if (cart) {
                await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            }
            return o;
        });
        (0, sockets_1.notifyOrderStatus)(buyerId, { orderId: order.id, status: client_1.OrderStatus.PLACED });
        return order;
    }
    static async listOrders(userId, role, filters) {
        const { status, page = 1, limit = 10 } = filters;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (role === 'BUYER') {
            where.buyerId = userId;
        }
        else if (role === 'FARMER') {
            // Find orders containing farmer's products
            where.items = {
                some: {
                    product: { ownerId: userId }
                }
            };
        }
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    items: { include: { product: true } },
                    buyer: { select: { id: true, name: true, phone: true } },
                    delivery: true,
                    payment: true
                }
            }),
            prisma_1.default.order.count({ where })
        ]);
        return {
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    static async getOrderById(orderId, userId, role) {
        const order = await prisma_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                buyer: { select: { id: true, name: true, phone: true } },
                delivery: true,
                payment: true
            }
        });
        if (!order)
            throw new Error('Order not found');
        // Access control
        if (role === 'BUYER' && order.buyerId !== userId) {
            throw new Error('Unauthorized');
        }
        if (role === 'FARMER') {
            const hasProduct = order.items.some((i) => i.product.ownerId === userId);
            if (!hasProduct)
                throw new Error('Unauthorized');
        }
        return order;
    }
    static async updateOrderStatus(orderId, status, userId, role) {
        const order = await prisma_1.default.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });
        if (!order)
            throw new Error('Order not found');
        if (role === 'FARMER') {
            // Farmers can only confirm or ship products they own
            const hasProduct = order.items.some((i) => i.product.ownerId === userId);
            if (!hasProduct)
                throw new Error('Unauthorized');
        }
        const updated = await prisma_1.default.order.update({
            where: { id: orderId },
            data: { status: status }
        });
        (0, sockets_1.notifyOrderStatus)(order.buyerId, { orderId: updated.id, status: updated.status });
        return updated;
    }
    static async deleteOrder(orderId) {
        await prisma_1.default.order.delete({ where: { id: orderId } });
        return { success: true };
    }
}
exports.OrderService = OrderService;
