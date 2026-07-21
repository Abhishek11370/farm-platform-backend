import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";
import { Request } from "express";
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("product")
@Public()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listProducts(@Query() query: ProductQueryDto) {
    return this.productsService.listProducts(query);
  }

  @Get("categories")
  async listCategories() {
    return this.productsService.listCategories();
  }

  @Post("categories")
  @Roles(Role.ADMIN)
  async createCategory(@Body("name") name: string) {
    return this.productsService.createCategory(name);
  }

  @Get("subcategories")
  async listSubCategories() {
    return this.productsService.listSubCategories();
  }

  @Post("subcategories")
  @Roles(Role.ADMIN)
  async createSubCategory(
    @Body("name") name: string,
    @Body("categoryId") categoryId: string,
  ) {
    return this.productsService.createSubCategory(name, categoryId);
  }

  @Get("units")
  async listUnits() {
    return this.productsService.listUnits();
  }

  @Post("units")
  @Roles(Role.ADMIN)
  async createUnit(@Body("name") name: string) {
    return this.productsService.createUnit(name);
  }

  @Get("grades")
  async listGrades() {
    return this.productsService.listGrades();
  }

  @Post("grades")
  @Roles(Role.ADMIN)
  async createGrade(@Body("name") name: string) {
    return this.productsService.createGrade(name);
  }

  @Get(":id")
  async getProductById(@Param("id") id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @Roles(Role.FARMER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(req.user.id, dto);
  }

  @Put(":id")
  @Roles(Role.FARMER, Role.ADMIN)
  async updateProduct(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(
      id,
      req.user.id,
      req.user.role,
      dto,
    );
  }

  @Delete(":id")
  @Roles(Role.FARMER, Role.ADMIN)
  async deleteProduct(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productsService.deleteProduct(id, req.user.id, req.user.role);
  }

  @Post(":id/images")
  @Roles(Role.FARMER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async addProductImage(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { imageUrl: string; isPrimary?: boolean },
  ) {
    return this.productsService.addProductImage(
      id,
      req.user.id,
      req.user.role,
      body,
    );
  }

  @Delete(":id/images/:imageId")
  @Roles(Role.FARMER, Role.ADMIN)
  async removeProductImage(
    @Param("id") id: string,
    @Param("imageId") imageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productsService.removeProductImage(
      id,
      imageId,
      req.user.id,
      req.user.role,
    );
  }

  @Get("myproducts")
  @Roles(Role.FARMER)
  async getMyProducts(@Req() req: AuthenticatedRequest) {
    return this.productsService.getMyProducts(req.user.id);
  }

}
