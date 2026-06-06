import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { toStringValue } from '../utils/to-string';

export class ReviewController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.createReview(toStringValue(req.user!.id), req.body);
      res.status(201).json({ data: review, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ReviewService.getProductReviews(toStringValue(req.params.productId));
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.updateReview(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role),
        req.body
      );
      res.json({ data: review, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await ReviewService.deleteReview(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role)
      );
      res.json({ data: { success: true }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
