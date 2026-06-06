import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { logAudit } from '../utils/audit';
import { toStringValue, toStringValueOrUndefined } from '../utils/to-string';

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(toStringValue(req.user!.id), req.body);
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'ORDER_CREATE',
        entity: 'Order',
        entityId: order.id,
        payload: { amount: order.totalAmount },
        ip: req.ip
      });
      res.status(201).json({ data: order, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: toStringValueOrUndefined(req.query.status),
        page: toStringValueOrUndefined(req.query.page) ? Number(toStringValue(req.query.page)) : undefined,
        limit: toStringValueOrUndefined(req.query.limit) ? Number(toStringValue(req.query.limit)) : undefined,
      };
      const result = await OrderService.listOrders(
        toStringValue(req.user!.id),
        toStringValue(req.user!.role),
        filters
      );
      res.json({ data: result.orders, meta: result.pagination, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role)
      );
      res.json({ data: order, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(
        toStringValue(req.params.id),
        toStringValue(status),
        toStringValue(req.user!.id),
        toStringValue(req.user!.role)
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'ORDER_STATUS_UPDATE',
        entity: 'Order',
        entityId: toStringValue(req.params.id),
        payload: { status: toStringValue(status) },
        ip: req.ip
      });
      res.json({ data: order, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await OrderService.deleteOrder(toStringValue(req.params.id));
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'ORDER_DELETE',
        entity: 'Order',
        entityId: toStringValue(req.params.id),
        ip: req.ip
      });
      res.json({ data: { success: true }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
