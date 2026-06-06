import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { logAudit } from '../utils/audit';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      await logAudit({
        userId: result.user.id,
        action: 'USER_REGISTER',
        entity: 'User',
        entityId: result.user.id,
        ip: req.ip
      });
      res.status(201).json({ data: result, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      await logAudit({
        userId: result.user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: result.user.id,
        ip: req.ip
      });
      res.json({ data: result, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'BAD_REQUEST', message: 'Refresh token is required' }
        });
      }
      const result = await AuthService.refresh(refreshToken);
      res.json({ data: result, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await logAudit({
          userId: req.user.id,
          action: 'USER_LOGOUT',
          entity: 'User',
          entityId: req.user.id,
          ip: req.ip
        });
      }
      res.json({ data: { message: 'Logged out successfully' }, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      res.json({ data: user, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updateProfile(req.user!.id, req.body);
      await logAudit({
        userId: req.user!.id,
        action: 'USER_PROFILE_UPDATE',
        entity: 'User',
        entityId: req.user!.id,
        ip: req.ip
      });
      res.json({ data: user, meta: null, error: null });
    } catch (err: any) {
      next(err);
    }
  }
}
