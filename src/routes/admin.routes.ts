import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/requirePermission';
import {
  getRoles,
  assignRole,
  revokeRole,
} from '../services/admin.service';

const router = Router();

router.use(authenticate);
router.use(requirePermission('roles:manage'));

router.get('/roles', async (_req, res, next) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

router.post('/users/:userId/roles', async (req, res, next) => {
  try {
    await assignRole(
      req.user.id,
      req.params.userId,
      req.body.roleName,
    );

    res.status(201).json({ message: 'Role assigned' });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:userId/roles/:roleName', async (req, res, next) => {
  try {
    await revokeRole(
      req.user.id,
      req.params.userId,
      req.params.roleName,
    );

    res.json({ message: 'Role revoked' });
  } catch (error) {
    next(error);
  }
});

export default router;