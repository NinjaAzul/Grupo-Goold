import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@shared/errors';
import { ROLES } from '@shared/constants';

export function ensureAuthorized(...allowedRoles: number[]) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
}

// Middleware específico para ADMIN
export const ensureAdmin = ensureAuthorized(ROLES.ADMIN);

// Middleware específico para USER
export const ensureUser = ensureAuthorized(ROLES.USER);

// Middleware para ADMIN ou USER
export const ensureAuthenticatedUser = ensureAuthorized(
  ROLES.ADMIN,
  ROLES.USER
);
