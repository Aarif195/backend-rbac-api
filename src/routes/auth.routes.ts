import { Router } from 'express';
import { login, register } from '../services/auth.service';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const user = await register(req.body.email, req.body.password);

    res.status(201).json({
      id: user.id,
      email: user.email,
      roles: user.roles.map((item) => item.role.name),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await login(req.body.email, req.body.password);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;