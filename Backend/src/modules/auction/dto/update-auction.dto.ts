import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
} from "class-validator";
import { AuctionStatus } from "@prisma/client";

export class UpdateAuctionDto {
  @IsEnum(AuctionStatus)
  @IsOptional()
  status?: AuctionStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;
}
