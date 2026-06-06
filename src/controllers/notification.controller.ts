import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { toStringValue } from '../utils/to-string';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await NotificationService.getNotifications(toStringValue(req.user!.id));
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notif = await NotificationService.markAsRead(
        toStringValue(req.params.id),
        toStringValue(req.user!.id)
      );
      res.json({ data: notif, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
