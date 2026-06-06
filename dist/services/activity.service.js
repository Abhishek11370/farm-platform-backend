"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class ActivityService {
    static async logActivity(userId, action, entityType, entityId) {
        return prisma_1.default.activity.create({
            data: {
                userId,
                action,
                entityType,
                entityId
            }
        });
    }
    static async getUserActivities(userId) {
        return prisma_1.default.activity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }
    static async getAllActivities() {
        return prisma_1.default.activity.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: { select: { id: true, name: true, role: true } }
            }
        });
    }
}
exports.ActivityService = ActivityService;
