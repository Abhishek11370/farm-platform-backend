import { Router } from 'express';
import { z } from 'zod';
import { DeliveryController } from '../controllers/delivery.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const assignDeliverySchema = z.object({
  body: z.object({
    orderId: z.string(),
    agentId: z.string(),
    pickupAddr: z.string()
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.string().min(1)
  })
});

const updateLocationSchema = z.object({
  body: z.object({
    latitude: z.number(),
    longitude: z.number()
  })
});

router.get('/deliveries', auth, DeliveryController.listDeliveries);
router.post('/assign', auth, allow(Role.ADMIN), validate(assignDeliverySchema), DeliveryController.assignDelivery);
router.patch('/deliveries/:id/status', auth, allow(Role.DELIVERY, Role.ADMIN), validate(updateStatusSchema), DeliveryController.updateDeliveryStatus);
router.patch('/deliveries/:id/location', auth, allow(Role.DELIVERY), validate(updateLocationSchema), DeliveryController.updateDeliveryLocation);
router.get('/earnings', auth, allow(Role.DELIVERY), DeliveryController.getEarnings);
router.get('/admin-earnings', auth, allow(Role.ADMIN), DeliveryController.getAdminEarnings);

export default router;
