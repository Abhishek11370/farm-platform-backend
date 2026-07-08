import { IsOptional, IsNumber, Min } from "class-validator";

export class ChatQueryDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
