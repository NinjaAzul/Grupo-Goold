"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const date_helper_1 = require("@shared/utils/date.helper");
class CreateAppointmentService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(request) {
        const appointment = await this.appointmentRepository.create(request);
        if (!appointment) {
            throw new Error('Falha ao criar agendamento');
        }
        const roomName = appointment.room?.name || 'Sala não encontrada';
        await logger_service_1.LoggerService.log('Criação de agendamento', 'Agendamento', request.userId, `Agendamento ${appointment.id} criado - Sala: ${roomName}, Data: ${request.appointmentDate}`);
        return { appointment: date_helper_1.DateHelper.normalizeDatesInObject(appointment) };
    }
}
exports.CreateAppointmentService = CreateAppointmentService;
//# sourceMappingURL=create.service.js.map