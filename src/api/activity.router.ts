import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { auth, allow } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth, ActivityController.getUserActivities);
router.get('/admin', auth, allow(Role.ADMIN), ActivityController.getAllActivities);

export default router;
