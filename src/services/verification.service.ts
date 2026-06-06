import prisma from '../utils/prisma';
import { uploadImage } from '../utils/cloudinary';
import { VerificationStatus } from '@prisma/client';

export class VerificationService {
  static async submitVerification(farmerId: string, data: any) {
    let { documentUrl, documentType } = data;
    
    if (documentUrl.startsWith('data:image') || documentUrl.startsWith('data:application')) {
      documentUrl = await uploadImage(documentUrl, 'verification-docs');
    }

    return prisma.farmerVerification.create({
      data: {
        farmerId,
        documentUrl,
        documentType,
        status: VerificationStatus.PENDING
      }
    });
  }

  static async getFarmerVerifications(farmerId: string) {
    return prisma.farmerVerification.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAllVerifications() {
    return prisma.farmerVerification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: { select: { id: true, name: true, email: true, phone: true } }
      }
    });
  }

  static async reviewVerification(verificationId: string, adminId: string, status: VerificationStatus) {
    return prisma.farmerVerification.update({
      where: { id: verificationId },
      data: {
        status,
        reviewedBy: adminId,
        reviewedAt: new Date()
      }
    });
  }
}
