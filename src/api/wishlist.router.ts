import { Router } from 'express';
import { z } from 'zod';
import { WishlistController } from '../controllers/wishlist.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const wishlistAddSchema = z.object({
  body: z.object({
    productId: z.string()
  })
});

router.get('/', auth, allow(Role.BUYER), WishlistController.getWishlist);
router.post('/', auth, allow(Role.BUYER), validate(wishlistAddSchema), WishlistController.addToWishlist);
router.delete('/:id', auth, allow(Role.BUYER), WishlistController.removeFromWishlist);

export default router;
