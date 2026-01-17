"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentService = void 0;
const create_repository_1 = require("./create.repository");
const logger_service_1 = require("@shared/utils/logger.service");
class CreateAppointmentService {
    constructor() {
        this.repository = new create_repository_1.CreateAppointmentRepository();
    }
    async execute(request) {
        const appointment = await this.repository.create(request);
        // Registrar log de criação
        await logger_service_1.LoggerService.log('Criação de agendamento', 'Agendamento', request.userId, `Agendamento ${appointment.id} criado - Sala: ${request.room}, Data: ${request.appointmentDate}`);
        return { appointment };
    }
}
exports.CreateAppointmentService = CreateAppointmentService;
//# sourceMappingURL=create.service.js.map