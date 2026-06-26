import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  subCategoryId?: string;

  @IsString()
  @IsOptional()
  gradeId?: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
