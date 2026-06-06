import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { toStringValue } from '../utils/to-string';

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(toStringValue(req.user!.id));
      res.json({ data: cart, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, qty } = req.body;
      const item = await CartService.addToCart(
        toStringValue(req.user!.id),
        toStringValue(productId),
        qty || 1
      );
      res.status(201).json({ data: item, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { qty } = req.body;
      const result = await CartService.updateCartItem(
        toStringValue(req.user!.id),
        toStringValue(req.params.itemId),
        qty
      );
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CartService.removeCartItem(
        toStringValue(req.user!.id),
        toStringValue(req.params.itemId)
      );
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
