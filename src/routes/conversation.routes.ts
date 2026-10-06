import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/requirePermission';
import {
  createConversation,
  getConversations,
} from '../services/conversation.service';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission('conversations:create'),
  async (req, res, next) => {
    try {
      const conversation = await createConversation(
        req.user.id,
        req.body.title,
      );

      res.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/',
  requirePermission('conversations:read'),
  async (req, res, next) => {
    try {
      const conversations = await getConversations(req.user.id);

      res.json(conversations);
    } catch (error) {
      next(error);
    }
  },
);

export default router;