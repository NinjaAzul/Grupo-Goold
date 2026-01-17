"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPermissionController = void 0;
const update_permission_service_1 = require("./update-permission.service");
class UpdateUserPermissionController {
    constructor() {
        this.service = new update_permission_service_1.UpdateUserPermissionService();
    }
    async handle(req, res, next) {
        try {
            const userId = Number(req.params.userId);
            const permissionId = Number(req.params.permissionId);
            if (isNaN(userId) || isNaN(permissionId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID or permission ID',
                });
            }
            // Validar que granted é um boolean
            if (typeof req.body.granted !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'granted must be a boolean',
                });
            }
            const data = {
                userId,
                permissionId,
                granted: req.body.granted,
            };
            const result = await this.service.execute(data);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UpdateUserPermissionController = UpdateUserPermissionController;
//# sourceMappingURL=update-permission.controller.js.map