import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to check if the user has a specific permission
 * Admins bypass permission checks and can do everything
 * @param permissionName - Name of the permission (e.g., 'APPOINTMENTS', 'LOGS')
 */
export declare function ensurePermission(permissionName: string): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=permission.middleware.d.ts.map