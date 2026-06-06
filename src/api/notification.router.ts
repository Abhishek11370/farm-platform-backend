import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', auth, NotificationController.getNotifications);
router.patch('/:id/read', auth, NotificationController.markAsRead);

export default router;
