"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
class ProductService {
    // PRODUCTS
    static async listProducts(filters) {
        const { search, categoryId, subCategoryId, gradeId, unitId, minPrice, maxPrice, page = 1, limit = 10 } = filters;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
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
            if (minPrice)
                where.price.gte = Number(minPrice);
            if (maxPrice)
                where.price.lte = Number(maxPrice);
        }
        const [products, total] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    images: true,
                    unit: true,
                    grade: true,
                    subCategory: { include: { category: true } },
                    owner: { select: { id: true, name: true, phone: true, email: true } }
                }
            }),
            prisma_1.default.product.count({ where })
        ]);
        return {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    static async getProductById(id) {
        const product = await prisma_1.default.product.findUnique({
            where: { id },
            include: {
                images: true,
                unit: true,
                grade: true,
                subCategory: { include: { category: true } },
                owner: { select: { id: true, name: true, phone: true, email: true } },
                reviews: { include: { buyer: { select: { id: true, name: true } } } }
            }
        });
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    static async createProduct(userId, data) {
        const { title, description, price, quantity, latitude, longitude, unitId, gradeId, subCategoryId, images } = data;
        // Create product
        const product = await prisma_1.default.product.create({
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
                ownerId: userId
            }
        });
        // Add images if provided (upload to Cloudinary if base64/files)
        if (images && Array.isArray(images) && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                let url = images[i];
                if (url.startsWith('data:image')) {
                    url = await (0, cloudinary_1.uploadImage)(url);
                }
                await prisma_1.default.productImage.create({
                    data: {
                        productId: product.id,
                        imageUrl: url,
                        isPrimary: i === 0
                    }
                });
            }
        }
        return this.getProductById(product.id);
    }
    static async updateProduct(productId, userId, userRole, data) {
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        if (product.ownerId !== userId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized to edit this product');
        }
        const { title, description, price, quantity, latitude, longitude, unitId, gradeId, subCategoryId } = data;
        await prisma_1.default.product.update({
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
                subCategoryId
            }
        });
        return this.getProductById(productId);
    }
    static async deleteProduct(productId, userId, userRole) {
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        if (product.ownerId !== userId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized to delete this product');
        }
        await prisma_1.default.product.delete({ where: { id: productId } });
        return { success: true };
    }
    static async addProductImage(productId, userId, userRole, data) {
        const product = await prisma_1.default.product.findUnique({ where: { id: productId }, include: { images: true } });
        if (!product)
            throw new Error('Product not found');
        if (product.ownerId !== userId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        let { imageUrl, isPrimary } = data;
        if (imageUrl.startsWith('data:image')) {
            imageUrl = await (0, cloudinary_1.uploadImage)(imageUrl);
        }
        // If setting as primary, unset other primaries
        if (isPrimary) {
            await prisma_1.default.productImage.updateMany({
                where: { productId },
                data: { isPrimary: false }
            });
        }
        const img = await prisma_1.default.productImage.create({
            data: {
                productId,
                imageUrl,
                isPrimary: isPrimary || product.images.length === 0
            }
        });
        return img;
    }
    static async removeProductImage(productId, imageId, userId, userRole) {
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        if (product.ownerId !== userId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        await prisma_1.default.productImage.delete({ where: { id: imageId } });
        return { success: true };
    }
    // CATEGORIES
    static async listCategories() {
        return prisma_1.default.category.findMany({
            include: { subCategories: true }
        });
    }
    static async createCategory(name) {
        return prisma_1.default.category.create({ data: { name } });
    }
    // SUB CATEGORIES
    static async listSubCategories() {
        return prisma_1.default.subCategory.findMany({
            include: { category: true }
        });
    }
    static async createSubCategory(name, categoryId) {
        return prisma_1.default.subCategory.create({ data: { name, categoryId } });
    }
    // UNITS
    static async listUnits() {
        return prisma_1.default.unit.findMany();
    }
    static async createUnit(name) {
        return prisma_1.default.unit.create({ data: { name } });
    }
    // GRADES
    static async listGrades() {
        return prisma_1.default.grade.findMany();
    }
    static async createGrade(name) {
        return prisma_1.default.grade.create({ data: { name } });
    }
}
exports.ProductService = ProductService;
