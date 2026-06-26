import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { AuctionStatus } from '@prisma/client';

export class AuctionQueryDto {
  @IsOptional()
  status?: AuctionStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
