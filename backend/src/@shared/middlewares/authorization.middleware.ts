import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@shared/errors';
import { ROLES } from '@shared/constants';

function ensureAuthorized(...allowedRoles: number[]) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('User not authenticated'));
      }

      if (!allowedRoles.includes(req.user.roleId)) {
        return next(new UnauthorizedError('Insufficient permissions'));
      }

      next();
    } catch (error) {
      return next(error);
    }
  };
}

export const ensureAdmin = ensureAuthorized(ROLES.ADMIN);
