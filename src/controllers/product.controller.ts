import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../modules/products/dto/create-product.dto';
import { UpdateProductDto } from '../modules/products/dto/update-product.dto';
import { ProductQueryDto } from '../modules/products/dto/product-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { RequestUser } from '../types/request-user';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async listProducts(@Query() query: ProductQueryDto) {
    return ProductService.listProducts(query);
  }

  @Get('categories')
  async listCategories() {
    return ProductService.listCategories();
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  async createCategory(@Body('name') name: string) {
    return ProductService.createCategory(name);
  }

  @Get('subcategories')
  async listSubCategories() {
    return ProductService.listSubCategories();
  }

  @Post('subcategories')
  @Roles(Role.ADMIN)
  async createSubCategory(@Body('name') name: string, @Body('categoryId') categoryId: string) {
    return ProductService.createSubCategory(name, categoryId);
  }

  @Get('units')
  async listUnits() {
    return ProductService.listUnits();
  }

  @Post('units')
  @Roles(Role.ADMIN)
  async createUnit(@Body('name') name: string) {
    return ProductService.createUnit(name);
  }

  @Get('grades')
  async listGrades() {
    return ProductService.listGrades();
  }

  @Post('grades')
  @Roles(Role.ADMIN)
  async createGrade(@Body('name') name: string) {
    return ProductService.createGrade(name);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return ProductService.getProductById(id);
  }

  @Post()
  @Roles(Role.FARMER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Req() req: AuthenticatedRequest, @Body() dto: CreateProductDto) {
    return ProductService.createProduct(req.user.id, dto);
  }

  @Put(':id')
  @Roles(Role.FARMER, Role.ADMIN)
  async updateProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() dto: UpdateProductDto) {
    return ProductService.updateProduct(id, req.user.id, req.user.role, dto);
  }

  @Delete(':id')
  @Roles(Role.FARMER, Role.ADMIN)
  async deleteProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return ProductService.deleteProduct(id, req.user.id, req.user.role);
  }

  @Post(':id/images')
  @Roles(Role.FARMER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async addProductImage(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() body: { imageUrl: string; isPrimary?: boolean }) {
    return ProductService.addProductImage(id, req.user.id, req.user.role, body);
  }

  @Delete(':id/images/:imageId')
  @Roles(Role.FARMER, Role.ADMIN)
  async removeProductImage(@Param('id') id: string, @Param('imageId') imageId: string, @Req() req: AuthenticatedRequest) {
    return ProductService.removeProductImage(id, imageId, req.user.id, req.user.role);
  }
}
