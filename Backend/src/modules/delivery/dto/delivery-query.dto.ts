import { IsString, IsOptional } from "class-validator";

export class DeliveryQueryDto {
  @IsString()
  @IsOptional()
  status?: string;
}
