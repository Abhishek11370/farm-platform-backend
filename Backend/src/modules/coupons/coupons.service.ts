import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Admin: Create a new coupon */
  async create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        expiryDate: new Date(dto.expiryDate),
        isActive: dto.isActive ?? true,
      },
    });
  }

  /** Admin: list all coupons */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [coupons, total] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.coupon.count(),
    ]);
    return { coupons, total, page, limit };
  }

  /** Get coupon by ID */
  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  /** Validate a coupon code and return discount details */
  async validate(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon is no longer active');
    if (new Date() > coupon.expiryDate) throw new BadRequestException('Coupon has expired');
    return {
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code,
    };
  }

  /** Admin: toggle coupon active/inactive */
  async toggleActive(id: string, isActive: boolean) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.update({ where: { id }, data: { isActive } });
  }

  /** Admin: delete coupon */
  async remove(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.delete({ where: { id } });
  }
}
