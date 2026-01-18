"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusController = void 0;
const update_status_service_1 = require("./update-status.service");
class UpdateStatusController {
    constructor() {
        this.service = new update_status_service_1.UpdateStatusService();
    }
    async handle(req, res, next) {
        try {
            const appointmentId = Number(req.params.id);
            const dto = req.body;
            const adminUserId = req.user?.id;
            const result = await this.service.execute({
                appointmentId,
                status: dto.status,
                adminUserId,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UpdateStatusController = UpdateStatusController;
//# sourceMappingURL=update-status.controller.js.map