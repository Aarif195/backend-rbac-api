import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/requirePermission';
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from '../services/document.service';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission('documents:create'),
  async (req, res, next) => {
    try {
      const document = await createDocument(
        req.user.id,
        req.body.title,
        req.body.content,
      );

      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/',
  requirePermission('documents:read'),
  async (req, res, next) => {
    try {
      const documents = await getDocuments(req.user.id);
      res.json(documents);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  requirePermission('documents:read'),
  async (req, res, next) => {
    try {
      const document = await getDocument(req.params.id, req.user.id);

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json(document);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  requirePermission('documents:update'),
  async (req, res, next) => {
    try {
      const result = await updateDocument(
        req.params.id,
        req.user.id,
        req.body.title,
        req.body.content,
      );

      if (result.count === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json({ message: 'Document updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  requirePermission('documents:delete'),
  async (req, res, next) => {
    try {
      const result = await deleteDocument(req.params.id, req.user.id);

      if (result.count === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;