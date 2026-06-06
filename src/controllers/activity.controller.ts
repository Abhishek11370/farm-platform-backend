import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';

export class ActivityController {
  static async getUserActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ActivityService.getUserActivities(req.user!.id);
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ActivityService.getAllActivities();
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
