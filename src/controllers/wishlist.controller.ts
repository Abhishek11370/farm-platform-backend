import { Request, Response, NextFunction } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { toStringValue } from '../utils/to-string';

export class WishlistController {
  static async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await WishlistService.getWishlist(toStringValue(req.user!.id));
      res.json({ data: items, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const item = await WishlistService.addToWishlist(toStringValue(req.user!.id), toStringValue(productId));
      res.status(201).json({ data: item, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WishlistService.removeFromWishlist(
        toStringValue(req.user!.id),
        toStringValue(req.params.id)
      );
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
