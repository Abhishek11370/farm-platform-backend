import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { uploadImage } from "../../utils/cloudinary";
import { ProductQueryDto } from "./dto/product-query.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // PRODUCTS
  async listProducts(filters: ProductQueryDto) {
    const {
      search,
      categoryId,
      subCategoryId,
      gradeId,
      unitId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.subCategory = { categoryId };
    }
    if (subCategoryId) {
      where.subCategoryId = subCategoryId;
    }
    if (gradeId) {
      where.gradeId = gradeId;
    }
    if (unitId) {
      where.unitId = unitId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          unit: true,
          grade: true,
          subCategory: { include: { category: true } },
          owner: { select: { id: true, name: true, phone: true, email: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        unit: true,
        grade: true,
        subCategory: { include: { category: true } },
        owner: { select: { id: true, name: true, phone: true, email: true } },
        reviews: { include: { buyer: { select: { id: true, name: true } } } },
      },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async createProduct(userId: string, data: CreateProductDto) {
    const {
      title,
      description,
      price,
      quantity,
      latitude,
      longitude,
      unitId,
      gradeId,
      subCategoryId,
      images,
    } = data;

    // Create product
    const product = await this.prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        quantity: Number(quantity),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        unitId,
        gradeId,
        subCategoryId,
        ownerId: userId,
      },
    });

    // Add images if provided (upload to Cloudinary if base64/files)
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        let url = images[i];
        if (url.startsWith("data:image")) {
          url = await uploadImage(url);
        }
        await this.prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: url,
            isPrimary: i === 0,
          },
        });
      }
    }

    return this.getProductById(product.id);
  }

  async updateProduct(
    productId: string,
    userId: string,
    userRole: string,
    data: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");

    if (product.ownerId !== userId && userRole !== "ADMIN") {
      throw new UnauthorizedException("Unauthorized to edit this product");
    }

    const {
      title,
      description,
      price,
      quantity,
      latitude,
      longitude,
      unitId,
      gradeId,
      subCategoryId,
    } = data;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: price ? Number(price) : undefined,
        quantity: quantity ? Number(quantity) : undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        unitId,
        gradeId,
        subCategoryId,
      },
    });

    return this.getProductById(productId);
  }

  async deleteProduct(productId: string, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");

    if (product.ownerId !== userId && userRole !== "ADMIN") {
      throw new UnauthorizedException("Unauthorized to delete this product");
    }

    await this.prisma.product.delete({ where: { id: productId } });
    return { success: true };
  }

  async addProductImage(
    productId: string,
    userId: string,
    userRole: string,
    data: any,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
    if (!product) throw new NotFoundException("Product not found");

    if (product.ownerId !== userId && userRole !== "ADMIN") {
      throw new UnauthorizedException("Unauthorized");
    }

    let { imageUrl, isPrimary } = data;
    if (imageUrl.startsWith("data:image")) {
      imageUrl = await uploadImage(imageUrl);
    }

    // If setting as primary, unset other primaries
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const img = await this.prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary: isPrimary || product.images.length === 0,
      },
    });

    return img;
  }

  async removeProductImage(
    productId: string,
    imageId: string,
    userId: string,
    userRole: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");

    if (product.ownerId !== userId && userRole !== "ADMIN") {
      throw new UnauthorizedException("Unauthorized");
    }

    await this.prisma.productImage.delete({ where: { id: imageId } });
    return { success: true };
  }

  // CATEGORIES
  async listCategories() {
    return this.prisma.category.findMany({
      include: { subCategories: true },
    });
  }

  async createCategory(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  // SUB CATEGORIES
  async listSubCategories() {
    return this.prisma.subCategory.findMany({
      include: { category: true },
    });
  }

  async createSubCategory(name: string, categoryId: string) {
    return this.prisma.subCategory.create({ data: { name, categoryId } });
  }

  // UNITS
  async listUnits() {
    return this.prisma.unit.findMany();
  }

  async createUnit(name: string) {
    return this.prisma.unit.create({ data: { name } });
  }

  // GRADES
  async listGrades() {
    return this.prisma.grade.findMany();
  }

  async createGrade(name: string) {
    return this.prisma.grade.create({ data: { name } });
  }
}
