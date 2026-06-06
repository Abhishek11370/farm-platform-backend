"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
const client_1 = require("@prisma/client");
class VerificationService {
    static async submitVerification(farmerId, data) {
        let { documentUrl, documentType } = data;
        if (documentUrl.startsWith('data:image') || documentUrl.startsWith('data:application')) {
            documentUrl = await (0, cloudinary_1.uploadImage)(documentUrl, 'verification-docs');
        }
        return prisma_1.default.farmerVerification.create({
            data: {
                farmerId,
                documentUrl,
                documentType,
                status: client_1.VerificationStatus.PENDING
            }
        });
    }
    static async getFarmerVerifications(farmerId) {
        return prisma_1.default.farmerVerification.findMany({
            where: { farmerId },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async getAllVerifications() {
        return prisma_1.default.farmerVerification.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                farmer: { select: { id: true, name: true, email: true, phone: true } }
            }
        });
    }
    static async reviewVerification(verificationId, adminId, status) {
        return prisma_1.default.farmerVerification.update({
            where: { id: verificationId },
            data: {
                status,
                reviewedBy: adminId,
                reviewedAt: new Date()
            }
        });
    }
}
exports.VerificationService = VerificationService;
