"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusController = void 0;
const update_status_service_1 = require("./update-status.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
class UpdateStatusController {
    constructor() {
        this.service = new update_status_service_1.UpdateStatusService();
    }
    async handle(req, res, next) {
        try {
            const appointmentId = Number(req.params.id);
            const { status } = req.body;
            if (!Object.values(appointment_interface_1.AppointmentStatus).includes(status)) {
                return res.status(400).json({
                    error: {
                        message: 'Invalid status. Must be: pending, scheduled, or cancelled',
                        statusCode: 400,
                    },
                });
            }
            const adminUserId = req.user?.id;
            const result = await this.service.execute({
                appointmentId,
                status: status,
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