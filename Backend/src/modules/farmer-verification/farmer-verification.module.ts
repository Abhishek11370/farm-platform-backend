import { Module } from '@nestjs/common';
import { FarmerVerificationController } from './farmer-verification.controller';
import { FarmerVerificationService } from './farmer-verification.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [FarmerVerificationController],
  providers: [FarmerVerificationService, PrismaService],
})
export class FarmerVerificationModule {}
