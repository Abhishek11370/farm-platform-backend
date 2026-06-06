import { Request, Response, NextFunction } from 'express';
import { VerificationService } from '../services/verification.service';
import { logAudit } from '../utils/audit';
import { VerificationStatus } from '@prisma/client';
import { toStringValue } from '../utils/to-string';

export class VerificationController {
  static async submitVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const v = await VerificationService.submitVerification(toStringValue(req.user!.id), req.body);
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'VERIFICATION_SUBMIT',
        entity: 'FarmerVerification',
        entityId: v.id,
        ip: req.ip
      });
      res.status(201).json({ data: v, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getFarmerVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await VerificationService.getFarmerVerifications(toStringValue(req.user!.id));
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getAllVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await VerificationService.getAllVerifications();
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async reviewVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const v = await VerificationService.reviewVerification(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        status
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'VERIFICATION_REVIEW',
        entity: 'FarmerVerification',
        entityId: toStringValue(req.params.id),
        payload: { status },
        ip: req.ip
      });
      res.json({ data: v, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
