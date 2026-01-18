"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentController = void 0;
const cancel_service_1 = require("./cancel.service");
class CancelAppointmentController {
    constructor() {
        this.service = new cancel_service_1.CancelAppointmentService();
    }
    async handle(req, res, next) {
        try {
            const appointmentId = Number(req.params.id);
            const userId = req.user.id;
            const result = await this.service.execute({
                appointmentId,
                userId,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.CancelAppointmentController = CancelAppointmentController;
//# sourceMappingURL=cancel.controller.js.map