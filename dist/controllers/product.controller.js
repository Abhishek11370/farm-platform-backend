"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const audit_1 = require("../utils/audit");
const to_string_1 = require("../utils/to-string");
class ProductController {
    static async listProducts(req, res, next) {
        try {
            const queryFilters = {
                search: (0, to_string_1.toStringValueOrUndefined)(req.query.search),
                categoryId: (0, to_string_1.toStringValueOrUndefined)(req.query.categoryId),
                subCategoryId: (0, to_string_1.toStringValueOrUndefined)(req.query.subCategoryId),
                gradeId: (0, to_string_1.toStringValueOrUndefined)(req.query.gradeId),
                unitId: (0, to_string_1.toStringValueOrUndefined)(req.query.unitId),
                minPrice: (0, to_string_1.toStringValueOrUndefined)(req.query.minPrice),
                maxPrice: (0, to_string_1.toStringValueOrUndefined)(req.query.maxPrice),
                page: (0, to_string_1.toStringValueOrUndefined)(req.query.page) ? Number((0, to_string_1.toStringValue)(req.query.page)) : undefined,
                limit: (0, to_string_1.toStringValueOrUndefined)(req.query.limit) ? Number((0, to_string_1.toStringValue)(req.query.limit)) : undefined,
            };
            const result = await product_service_1.ProductService.listProducts(queryFilters);
            res.json({ data: result.products, meta: result.pagination, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getProductById(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getProductById((0, to_string_1.toStringValue)(req.params.id));
            res.json({ data: product, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createProduct(req, res, next) {
        try {
            const product = await product_service_1.ProductService.createProduct((0, to_string_1.toStringValue)(req.user.id), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'PRODUCT_CREATE',
                entity: 'Product',
                entityId: product.id,
                payload: { title: product.title },
                ip: req.ip
            });
            res.status(201).json({ data: product, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const product = await product_service_1.ProductService.updateProduct((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'PRODUCT_UPDATE',
                entity: 'Product',
                entityId: product.id,
                ip: req.ip
            });
            res.json({ data: product, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            await product_service_1.ProductService.deleteProduct((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role));
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'PRODUCT_DELETE',
                entity: 'Product',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                ip: req.ip
            });
            res.json({ data: { success: true }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async addProductImage(req, res, next) {
        try {
            const img = await product_service_1.ProductService.addProductImage((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role), req.body);
            res.status(201).json({ data: img, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeProductImage(req, res, next) {
        try {
            await product_service_1.ProductService.removeProductImage((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.params.imageId), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role));
            res.json({ data: { success: true }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    // CATEGORIES
    static async listCategories(req, res, next) {
        try {
            const list = await product_service_1.ProductService.listCategories();
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const cat = await product_service_1.ProductService.createCategory(req.body.name);
            res.status(201).json({ data: cat, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    // SUB CATEGORIES
    static async listSubCategories(req, res, next) {
        try {
            const list = await product_service_1.ProductService.listSubCategories();
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createSubCategory(req, res, next) {
        try {
            const sc = await product_service_1.ProductService.createSubCategory(req.body.name, req.body.categoryId);
            res.status(201).json({ data: sc, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    // UNITS
    static async listUnits(req, res, next) {
        try {
            res.json({ data: await product_service_1.ProductService.listUnits(), meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createUnit(req, res, next) {
        try {
            res.status(201).json({ data: await product_service_1.ProductService.createUnit(req.body.name), meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    // GRADES
    static async listGrades(req, res, next) {
        try {
            res.json({ data: await product_service_1.ProductService.listGrades(), meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createGrade(req, res, next) {
        try {
            res.status(201).json({ data: await product_service_1.ProductService.createGrade(req.body.name), meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ProductController = ProductController;
