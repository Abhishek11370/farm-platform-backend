import { IsString, IsOptional, IsNumber, Min, Max, IsArray } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  gradeId?: string;

  @IsString()
  @IsOptional()
  subCategoryId?: string;
}
