import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  private get addressSelect() {
    return {
      id: true,
      userId: true,
      fullName: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      pincode: true,
      isDefault: true,
      createdAt: true,
    };
  }

  async listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
      select: this.addressSelect,
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault,
    } = dto;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      },
      select: this.addressSelect,
    });
  }

  async updateAddress(
    addressId: string,
    userId: string,
    dto: UpdateAddressDto,
  ) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new NotFoundException("Address not found");
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault,
    } = dto;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault,
      },
      select: this.addressSelect,
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new NotFoundException("Address not found");
    }

    await this.prisma.address.delete({ where: { id: addressId } });
    return { success: true };
  }
}
