"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class AddressService {
    static async listAddresses(userId) {
        return prisma_1.default.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }
        });
    }
    static async createAddress(userId, data) {
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = data;
        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false }
            });
        }
        const addr = await prisma_1.default.address.create({
            data: {
                userId,
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                isDefault: isDefault || false
            }
        });
        return addr;
    }
    static async updateAddress(addressId, userId, data) {
        const address = await prisma_1.default.address.findUnique({ where: { id: addressId } });
        if (!address || address.userId !== userId)
            throw new Error('Address not found');
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = data;
        if (isDefault) {
            await prisma_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false }
            });
        }
        return prisma_1.default.address.update({
            where: { id: addressId },
            data: {
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                isDefault
            }
        });
    }
    static async deleteAddress(addressId, userId) {
        const address = await prisma_1.default.address.findUnique({ where: { id: addressId } });
        if (!address || address.userId !== userId)
            throw new Error('Address not found');
        await prisma_1.default.address.delete({ where: { id: addressId } });
        return { success: true };
    }
}
exports.AddressService = AddressService;
