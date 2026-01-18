"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensurePermission = ensurePermission;
const errors_1 = require("@shared/errors");
const constants_1 = require("@shared/constants");
/**
 * Middleware to check if the user has a specific permission
 * Admins bypass permission checks and can do everything
 * @param permissionName - Name of the permission (e.g., 'APPOINTMENTS', 'LOGS')
 */
function ensurePermission(permissionName) {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                return next(new errors_1.UnauthorizedError('User not authenticated'));
            }
            const user = req.user;
            if (user.roleId === constants_1.ROLES.ADMIN) {
                return next();
            }
            if (!user.permissions || user.permissions.length === 0) {
                return next(new errors_1.UnauthorizedError(`Permission '${permissionName}' is required`));
            }
            const permission = user.permissions.find((p) => p.permission?.name === permissionName && p.granted === true);
            if (!permission) {
                return next(new errors_1.UnauthorizedError(`Permission '${permissionName}' is required`));
            }
            next();
        }
        catch (error) {
            return next(error);
        }
    };
}
//# sourceMappingURL=permission.middleware.js.map