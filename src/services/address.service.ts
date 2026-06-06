import prisma from '../utils/prisma';

export class AddressService {
  static async listAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
  }

  static async createAddress(userId: string, data: any) {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = data;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const addr = await prisma.address.create({
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

  static async updateAddress(addressId: string, userId: string, data: any) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) throw new Error('Address not found');

    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return prisma.address.update({
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

  static async deleteAddress(addressId: string, userId: string) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) throw new Error('Address not found');

    await prisma.address.delete({ where: { id: addressId } });
    return { success: true };
  }
}
