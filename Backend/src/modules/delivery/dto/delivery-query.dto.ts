import { IsString, IsOptional, IsNumber } from "class-validator";

export class DeliveryQueryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
