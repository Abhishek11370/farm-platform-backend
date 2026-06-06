import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(Role).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string()
  }).refine(data => data.email || data.phone, {
    message: 'Either email or phone must be provided'
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(6).optional()
  })
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', auth, AuthController.logout);
router.get('/me', auth, AuthController.getMe);
router.patch('/profile', auth, validate(updateProfileSchema), AuthController.updateProfile);

export default router;
