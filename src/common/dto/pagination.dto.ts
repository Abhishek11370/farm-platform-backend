import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
