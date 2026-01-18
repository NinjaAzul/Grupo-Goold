"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
class CreateAppointmentService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(request) {
        const appointment = await this.appointmentRepository.create(request);
        if (!appointment) {
            throw new Error('Falha ao criar agendamento');
        }
        await logger_service_1.LoggerService.log('Criação de agendamento', 'Agendamento', request.userId, `Agendamento ${appointment.id} criado - Sala: ${request.room}, Data: ${request.appointmentDate}`);
        return { appointment };
    }
}
exports.CreateAppointmentService = CreateAppointmentService;
//# sourceMappingURL=create.service.js.map