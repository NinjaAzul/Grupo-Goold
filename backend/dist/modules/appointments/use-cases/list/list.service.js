"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
class ListAppointmentsService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(request) {
        const { rows, count } = await this.appointmentRepository.findAll(request);
        const page = request.page || 1;
        const limit = request.limit || 10;
        const totalPages = Math.ceil(count / limit);
        return {
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
            },
        };
    }
}
exports.ListAppointmentsService = ListAppointmentsService;
//# sourceMappingURL=list.service.js.map