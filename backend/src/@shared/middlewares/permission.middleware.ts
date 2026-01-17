import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@shared/errors';
import { IUserPermission } from '@modules/users';
import { ROLES } from '@shared/constants';

/**
 * Middleware to check if the user has a specific permission
 * Admins bypass permission checks and can do everything
 * @param permissionName - Name of the permission (e.g., 'APPOINTMENTS', 'LOGS')
 */
export function ensurePermission(permissionName: string) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('User not authenticated'));
      }

      const user = req.user as typeof req.user & {
        permissions?: IUserPermission[];
        roleId?: number;
      };

      if (user.roleId === ROLES.ADMIN) {
        return next();
      }

      if (!user.permissions || user.permissions.length === 0) {
        return next(
          new UnauthorizedError(`Permission '${permissionName}' is required`)
        );
      }

      const permission = user.permissions.find(
        (p: IUserPermission) =>
          p.permission?.name === permissionName && p.granted === true
      );

      if (!permission) {
        return next(
          new UnauthorizedError(`Permission '${permissionName}' is required`)
        );
      }

      next();
    } catch (error) {
      return next(error);
    }
  };
}
