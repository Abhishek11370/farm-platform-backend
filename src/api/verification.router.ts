import { Router } from 'express';
import { z } from 'zod';
import { VerificationController } from '../controllers/verification.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role, VerificationStatus } from '@prisma/client';

const router = Router();

const submitSchema = z.object({
  body: z.object({
    documentUrl: z.string(),
    documentType: z.string()
  })
});

const reviewSchema = z.object({
  body: z.object({
    status: z.nativeEnum(VerificationStatus)
  })
});

router.post('/', auth, allow(Role.FARMER), validate(submitSchema), VerificationController.submitVerification);
router.get('/', auth, allow(Role.FARMER), VerificationController.getFarmerVerifications);
router.get('/admin', auth, allow(Role.ADMIN), VerificationController.getAllVerifications);
router.patch('/:id/review', auth, allow(Role.ADMIN), validate(reviewSchema), VerificationController.reviewVerification);

export default router;
