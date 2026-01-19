"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentController = void 0;
const create_service_1 = require("./create.service");
const date_helper_1 = require("@shared/utils/date.helper");
class CreateAppointmentController {
    constructor() {
        this.service = new create_service_1.CreateAppointmentService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
            const dto = req.body;
            // Usar DateHelper.fromISOString para garantir que a data seja tratada como UTC
            const appointmentDate = date_helper_1.DateHelper.fromISOString(dto.appointmentDate);
            const result = await this.service.execute({
                userId,
                appointmentDate,
                roomId: dto.roomId,
            });
            return res.status(201).json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.CreateAppointmentController = CreateAppointmentController;
//# sourceMappingURL=create.controller.js.map