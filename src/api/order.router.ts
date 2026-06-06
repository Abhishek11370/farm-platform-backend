import { Router } from 'express';
import { z } from 'zod';
import { OrderController } from '../controllers/order.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role, OrderStatus } from '@prisma/client';

const router = Router();

const orderCreateSchema = z.object({
  body: z.object({
    addressId: z.string(),
    couponCode: z.string().optional(),
    items: z.array(z.object({
      productId: z.string(),
      qty: z.number().positive()
    }))
  })
});

const orderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus)
  })
});

router.get('/', auth, OrderController.listOrders);
router.get('/:id', auth, OrderController.getOrderById);
router.post('/', auth, allow(Role.BUYER), validate(orderCreateSchema), OrderController.createOrder);
router.patch('/:id/status', auth, allow(Role.FARMER, Role.ADMIN), validate(orderStatusSchema), OrderController.updateOrderStatus);
router.delete('/:id', auth, allow(Role.ADMIN), OrderController.deleteOrder);

export default router;
