import { Router } from 'express';
import { z } from 'zod';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const productCreateSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    price: z.number().positive(),
    quantity: z.number().nonnegative(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    unitId: z.string().optional(),
    gradeId: z.string().optional(),
    subCategoryId: z.string().optional(),
    images: z.array(z.string()).optional()
  })
});

const productUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    quantity: z.number().nonnegative().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    unitId: z.string().optional(),
    gradeId: z.string().optional(),
    subCategoryId: z.string().optional()
  })
});

const imageCreateSchema = z.object({
  body: z.object({
    imageUrl: z.string(),
    isPrimary: z.boolean().optional()
  })
});

const nameSchema = z.object({
  body: z.object({
    name: z.string().min(1)
  })
});

const subCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    categoryId: z.string()
  })
});

// Products CRUD
router.get('/', auth, ProductController.listProducts);
router.get('/:id', auth, ProductController.getProductById);
router.post('/', auth, allow(Role.FARMER, Role.ADMIN), validate(productCreateSchema), ProductController.createProduct);
router.put('/:id', auth, allow(Role.FARMER, Role.ADMIN), validate(productUpdateSchema), ProductController.updateProduct);
router.delete('/:id', auth, allow(Role.FARMER, Role.ADMIN), ProductController.deleteProduct);

// Product Images
router.post('/:id/images', auth, allow(Role.FARMER, Role.ADMIN), validate(imageCreateSchema), ProductController.addProductImage);
router.delete('/:id/images/:imageId', auth, allow(Role.FARMER, Role.ADMIN), ProductController.removeProductImage);

// Catalog Categories
router.get('/categories', auth, ProductController.listCategories);
router.post('/categories', auth, allow(Role.ADMIN), validate(nameSchema), ProductController.createCategory);

// Catalog SubCategories
router.get('/subcategories', auth, ProductController.listSubCategories);
router.post('/subcategories', auth, allow(Role.ADMIN), validate(subCategorySchema), ProductController.createSubCategory);

// Catalog Units
router.get('/units', auth, ProductController.listUnits);
router.post('/units', auth, allow(Role.ADMIN), validate(nameSchema), ProductController.createUnit);

// Catalog Grades
router.get('/grades', auth, ProductController.listGrades);
router.post('/grades', auth, allow(Role.ADMIN), validate(nameSchema), ProductController.createGrade);

export default router;
