"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentController = void 0;
const create_service_1 = require("./create.service");
class CreateAppointmentController {
    constructor() {
        this.service = new create_service_1.CreateAppointmentService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
            const dto = req.body;
            const appointmentDate = new Date(dto.appointmentDate);
            const result = await this.service.execute({
                userId,
                appointmentDate,
                room: dto.room,
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