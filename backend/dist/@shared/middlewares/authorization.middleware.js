"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = void 0;
const errors_1 = require("@shared/errors");
const constants_1 = require("@shared/constants");
function ensureAuthorized(...allowedRoles) {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                return next(new errors_1.UnauthorizedError('User not authenticated'));
            }
            if (!allowedRoles.includes(req.user.roleId)) {
                return next(new errors_1.UnauthorizedError('Insufficient permissions'));
            }
            next();
        }
        catch (error) {
            return next(error);
        }
    };
}
// Middleware específico para ADMIN
exports.ensureAdmin = ensureAuthorized(constants_1.ROLES.ADMIN);
//# sourceMappingURL=authorization.middleware.js.map