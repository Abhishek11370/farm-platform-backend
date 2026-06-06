import { Router } from 'express';
import { z } from 'zod';
import { ReviewController } from '../controllers/review.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const reviewSchema = z.object({
  body: z.object({
    productId: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
  })
});

const reviewUpdateSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional()
  })
});

router.post('/', auth, allow(Role.BUYER), validate(reviewSchema), ReviewController.createReview);
router.get('/:productId', auth, ReviewController.getProductReviews);
router.put('/:id', auth, allow(Role.BUYER, Role.ADMIN), validate(reviewUpdateSchema), ReviewController.updateReview);
router.delete('/:id', auth, allow(Role.BUYER, Role.ADMIN), ReviewController.deleteReview);

export default router;
