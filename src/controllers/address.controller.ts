import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service';
import { toStringValue } from '../utils/to-string';

export class AddressController {
  static async listAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await AddressService.listAddresses(toStringValue(req.user!.id));
      res.json({ data: addresses, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await AddressService.createAddress(toStringValue(req.user!.id), req.body);
      res.status(201).json({ data: address, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await AddressService.updateAddress(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        req.body
      );
      res.json({ data: address, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      await AddressService.deleteAddress(toStringValue(req.params.id), toStringValue(req.user!.id));
      res.json({ data: { success: true }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
