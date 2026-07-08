import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitVerificationDto, ReviewVerificationDto } from './dto/farmer-verification.dto';

@Injectable()
export class FarmerVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  /** Farmer: submit KYC document for verification */
  async submit(farmerId: string, dto: SubmitVerificationDto) {
    return this.prisma.farmerVerification.create({
      data: {
        farmerId,
        documentUrl: dto.documentUrl,
        documentType: dto.documentType,
      },
    });
  }

  /** Farmer: get their own verification records */
  async findMine(farmerId: string) {
    return this.prisma.farmerVerification.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin: list all verifications (paginated) */
  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};
    const [verifications, total] = await this.prisma.$transaction([
      this.prisma.farmerVerification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { farmer: { select: { id: true, name: true, email: true, phone: true } } },
      }),
      this.prisma.farmerVerification.count({ where }),
    ]);
    return { verifications, total, page, limit };
  }

  /** Admin: approve or reject a verification */
  async review(id: string, adminId: string, dto: ReviewVerificationDto) {
    const verification = await this.prisma.farmerVerification.findUnique({ where: { id } });
    if (!verification) throw new NotFoundException('Verification record not found');
    return this.prisma.farmerVerification.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });
  }

  /** Get a single verification record */
  async findOne(id: string) {
    const verification = await this.prisma.farmerVerification.findUnique({ where: { id }, include: { farmer: true } });
    if (!verification) throw new NotFoundException('Verification not found');
    return verification;
  }
}
