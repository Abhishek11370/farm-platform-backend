import { IsString, IsOptional, IsNumber, Min, Max, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
