"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const product_controller_1 = require("../controllers/product.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const productCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive(),
        quantity: zod_1.z.number().nonnegative(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        unitId: zod_1.z.string().optional(),
        gradeId: zod_1.z.string().optional(),
        subCategoryId: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional()
    })
});
const productUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        quantity: zod_1.z.number().nonnegative().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        unitId: zod_1.z.string().optional(),
        gradeId: zod_1.z.string().optional(),
        subCategoryId: zod_1.z.string().optional()
    })
});
const imageCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        imageUrl: zod_1.z.string(),
        isPrimary: zod_1.z.boolean().optional()
    })
});
const nameSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1)
    })
});
const subCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        categoryId: zod_1.z.string()
    })
});
// Products CRUD
router.get('/', auth_1.auth, product_controller_1.ProductController.listProducts);
router.get('/:id', auth_1.auth, product_controller_1.ProductController.getProductById);
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(productCreateSchema), product_controller_1.ProductController.createProduct);
router.put('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(productUpdateSchema), product_controller_1.ProductController.updateProduct);
router.delete('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), product_controller_1.ProductController.deleteProduct);
// Product Images
router.post('/:id/images', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(imageCreateSchema), product_controller_1.ProductController.addProductImage);
router.delete('/:id/images/:imageId', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), product_controller_1.ProductController.removeProductImage);
// Catalog Categories
router.get('/categories', auth_1.auth, product_controller_1.ProductController.listCategories);
router.post('/categories', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(nameSchema), product_controller_1.ProductController.createCategory);
// Catalog SubCategories
router.get('/subcategories', auth_1.auth, product_controller_1.ProductController.listSubCategories);
router.post('/subcategories', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(subCategorySchema), product_controller_1.ProductController.createSubCategory);
// Catalog Units
router.get('/units', auth_1.auth, product_controller_1.ProductController.listUnits);
router.post('/units', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(nameSchema), product_controller_1.ProductController.createUnit);
// Catalog Grades
router.get('/grades', auth_1.auth, product_controller_1.ProductController.listGrades);
router.post('/grades', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(nameSchema), product_controller_1.ProductController.createGrade);
exports.default = router;
