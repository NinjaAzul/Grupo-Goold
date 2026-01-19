"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListAppointmentsService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const date_helper_1 = require("@shared/utils/date.helper");
class AdminListAppointmentsService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const { appointments, total } = await this.appointmentRepository.findAllAdmin(filters);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: date_helper_1.DateHelper.normalizeDatesInObject(appointments),
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.AdminListAppointmentsService = AdminListAppointmentsService;
//# sourceMappingURL=admin-list.service.js.map