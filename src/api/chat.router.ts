import { Router } from 'express';
import { z } from 'zod';
import { ChatController } from '../controllers/chat.controller';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';

const router = Router();

const sendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string(),
    content: z.string().min(1)
  })
});

router.get('/:partnerId', auth, ChatController.getMessages);
router.post('/', auth, validate(sendMessageSchema), ChatController.sendMessage);

export default router;
