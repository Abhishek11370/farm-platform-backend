import { Router } from 'express';
import { z } from 'zod';
import { CartController } from '../controllers/cart.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    qty: z.number().positive()
  })
});

const updateCartSchema = z.object({
  body: z.object({
    qty: z.number().nonnegative()
  })
});

router.get('/', auth, allow(Role.BUYER), CartController.getCart);
router.post('/add', auth, allow(Role.BUYER), validate(addToCartSchema), CartController.addToCart);
router.patch('/update/:itemId', auth, allow(Role.BUYER), validate(updateCartSchema), CartController.updateCartItem);
router.delete('/remove/:itemId', auth, allow(Role.BUYER), CartController.removeCartItem);

export default router;
