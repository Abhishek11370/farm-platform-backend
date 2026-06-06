import { Router } from 'express';
import { z } from 'zod';
import { AddressController } from '../controllers/address.controller';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';

const router = Router();

const addressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
    isDefault: z.boolean().optional()
  })
});

const addressUpdateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    addressLine1: z.string().min(3).optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    pincode: z.string().min(6).optional(),
    isDefault: z.boolean().optional()
  })
});

router.get('/', auth, AddressController.listAddresses);
router.post('/', auth, validate(addressSchema), AddressController.createAddress);
router.put('/:id', auth, validate(addressUpdateSchema), AddressController.updateAddress);
router.delete('/:id', auth, AddressController.deleteAddress);

export default router;
