import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsBoolean, IsOptional, Min } from 'class-validator';
import { CouponDiscountType } from '@prisma/client';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(CouponDiscountType)
  discountType: CouponDiscountType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsDateString()
  expiryDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
