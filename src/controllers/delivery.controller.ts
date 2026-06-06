import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { logAudit } from '../utils/audit';
import { toStringValue, toStringValueOrUndefined } from '../utils/to-string';

export class DeliveryController {
  static async listDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: toStringValueOrUndefined(req.query.status),
      };
      const list = await DeliveryService.listDeliveries(
        toStringValue(req.user!.id),
        toStringValue(req.user!.role),
        filters
      );
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async assignDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, agentId, pickupAddr } = req.body;
      const d = await DeliveryService.assignDelivery(
        toStringValue(orderId),
        toStringValue(agentId),
        toStringValue(pickupAddr)
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'DELIVERY_ASSIGN',
        entity: 'DeliveryAssignment',
        entityId: d.id,
        payload: { orderId: toStringValue(orderId), agentId: toStringValue(agentId) },
        ip: req.ip
      });
      res.json({ data: d, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateDeliveryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const d = await DeliveryService.updateDeliveryStatus(
        toStringValue(req.params.id),
        toStringValue(status),
        toStringValue(req.user!.id)
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'DELIVERY_STATUS_UPDATE',
        entity: 'DeliveryAssignment',
        entityId: toStringValue(req.params.id),
        payload: { status: toStringValue(status) },
        ip: req.ip
      });
      res.json({ data: d, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateDeliveryLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude } = req.body;
      const d = await DeliveryService.updateDeliveryLocation(
        toStringValue(req.params.id),
        Number(latitude),
        Number(longitude),
        toStringValue(req.user!.id)
      );
      res.json({ data: d, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DeliveryService.getEarnings(toStringValue(req.user!.id));
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getAdminEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DeliveryService.getAdminEarnings();
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
