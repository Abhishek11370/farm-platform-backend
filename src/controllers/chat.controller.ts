import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { toStringValue } from '../utils/to-string';

export class ChatController {
  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ChatService.getMessages(
        toStringValue(req.user!.id),
        toStringValue(req.params.partnerId)
      );
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { receiverId, content } = req.body;
      const msg = await ChatService.sendMessage(
        toStringValue(req.user!.id),
        toStringValue(receiverId),
        content
      );
      res.status(201).json({ data: msg, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
