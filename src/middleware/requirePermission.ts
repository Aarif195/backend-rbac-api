import { Request, Response, NextFunction } from 'express';
import { getUserPermissions } from '../services/permission.service';
import { ForbiddenError } from '../lib/errors';

export const requirePermission = (permission: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError();
      }

      const permissions = await getUserPermissions(userId);

      if (!permissions.includes(permission)) {
        throw new ForbiddenError();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};