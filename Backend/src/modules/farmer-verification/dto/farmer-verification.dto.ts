import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class SubmitVerificationDto {
  @IsString()
  @IsNotEmpty()
  documentUrl: string;

  @IsString()
  @IsNotEmpty()
  documentType: string;
}

export class ReviewVerificationDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;
}
