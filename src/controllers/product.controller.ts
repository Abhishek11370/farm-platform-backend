import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { logAudit } from '../utils/audit';
import { toStringValue, toStringValueOrUndefined } from '../utils/to-string';

export class ProductController {
  static async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const queryFilters = {
        search: toStringValueOrUndefined(req.query.search),
        categoryId: toStringValueOrUndefined(req.query.categoryId),
        subCategoryId: toStringValueOrUndefined(req.query.subCategoryId),
        gradeId: toStringValueOrUndefined(req.query.gradeId),
        unitId: toStringValueOrUndefined(req.query.unitId),
        minPrice: toStringValueOrUndefined(req.query.minPrice),
        maxPrice: toStringValueOrUndefined(req.query.maxPrice),
        page: toStringValueOrUndefined(req.query.page) ? Number(toStringValue(req.query.page)) : undefined,
        limit: toStringValueOrUndefined(req.query.limit) ? Number(toStringValue(req.query.limit)) : undefined,
      };
      const result = await ProductService.listProducts(queryFilters);
      res.json({ data: result.products, meta: result.pagination, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(toStringValue(req.params.id));
      res.json({ data: product, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(toStringValue(req.user!.id), req.body);
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'PRODUCT_CREATE',
        entity: 'Product',
        entityId: product.id,
        payload: { title: product.title },
        ip: req.ip
      });
      res.status(201).json({ data: product, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role),
        req.body
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'PRODUCT_UPDATE',
        entity: 'Product',
        entityId: product.id,
        ip: req.ip
      });
      res.json({ data: product, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role)
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'PRODUCT_DELETE',
        entity: 'Product',
        entityId: toStringValue(req.params.id),
        ip: req.ip
      });
      res.json({ data: { success: true }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async addProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      const img = await ProductService.addProductImage(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role),
        req.body
      );
      res.status(201).json({ data: img, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async removeProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.removeProductImage(
        toStringValue(req.params.id),
        toStringValue(req.params.imageId),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role)
      );
      res.json({ data: { success: true }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  // CATEGORIES
  static async listCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ProductService.listCategories();
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await ProductService.createCategory(req.body.name);
      res.status(201).json({ data: cat, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  // SUB CATEGORIES
  static async listSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ProductService.listSubCategories();
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const sc = await ProductService.createSubCategory(req.body.name, req.body.categoryId);
      res.status(201).json({ data: sc, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  // UNITS
  static async listUnits(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await ProductService.listUnits(), meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ data: await ProductService.createUnit(req.body.name), meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  // GRADES
  static async listGrades(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await ProductService.listGrades(), meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createGrade(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ data: await ProductService.createGrade(req.body.name), meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
