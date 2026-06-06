"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sockets_1 = require("../sockets");
class DeliveryService {
    static async listDeliveries(userId, role, filters) {
        const { status } = filters;
        const where = {};
        if (role === 'DELIVERY') {
            where.agentId = userId;
        }
        if (status) {
            where.status = status;
        }
        return prisma_1.default.deliveryAssignment.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                order: {
                    include: {
                        buyer: { select: { name: true, phone: true } },
                        items: { include: { product: true } }
                    }
                }
            }
        });
    }
    static async assignDelivery(orderId, agentId, pickupAddr) {
        return prisma_1.default.deliveryAssignment.update({
            where: { orderId },
            data: {
                agentId,
                pickupAddr,
                status: 'ACCEPTED'
            }
        });
    }
    static async updateDeliveryStatus(deliveryId, status, userId) {
        const delivery = await prisma_1.default.deliveryAssignment.findUnique({ where: { id: deliveryId }, include: { order: true } });
        if (!delivery || delivery.agentId !== userId)
            throw new Error('Delivery assignment not found');
        const updated = await prisma_1.default.deliveryAssignment.update({
            where: { id: deliveryId },
            data: { status }
        });
        // If completed, calculate earnings (e.g. flat delivery fee of 50 INR + 5% of order value)
        if (status === 'COMPLETED') {
            const amount = 50 + (delivery.order.totalAmount * 0.05);
            await prisma_1.default.deliveryEarning.create({
                data: {
                    deliveryId,
                    agentId: userId,
                    amount
                }
            });
            // Update order status as well
            await prisma_1.default.order.update({
                where: { id: delivery.orderId },
                data: { status: 'DELIVERED' }
            });
        }
        return updated;
    }
    static async updateDeliveryLocation(deliveryId, lat, lng, userId) {
        const delivery = await prisma_1.default.deliveryAssignment.findUnique({ where: { id: deliveryId } });
        if (!delivery || delivery.agentId !== userId)
            throw new Error('Delivery assignment not found');
        const updated = await prisma_1.default.deliveryAssignment.update({
            where: { id: deliveryId },
            data: {
                gpsLat: Number(lat),
                gpsLng: Number(lng)
            }
        });
        // Broadcast live to socket room
        (0, sockets_1.broadcastDeliveryLocation)(deliveryId, { deliveryId, lat, lng });
        return updated;
    }
    static async getEarnings(userId) {
        const earnings = await prisma_1.default.deliveryEarning.findMany({
            where: { agentId: userId },
            orderBy: { createdAt: 'desc' },
            include: { delivery: true }
        });
        const total = earnings.reduce((sum, e) => sum + e.amount, 0);
        return {
            earnings,
            total
        };
    }
    static async getAdminEarnings() {
        const earnings = await prisma_1.default.deliveryEarning.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                agent: { select: { id: true, name: true } },
                delivery: true
            }
        });
        const total = earnings.reduce((sum, e) => sum + e.amount, 0);
        return {
            earnings,
            total
        };
    }
}
exports.DeliveryService = DeliveryService;
