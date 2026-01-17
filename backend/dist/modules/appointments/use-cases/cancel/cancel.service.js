"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentService = void 0;
const cancel_repository_1 = require("./cancel.repository");
const logger_service_1 = require("@shared/utils/logger.service");
class CancelAppointmentService {
    constructor() {
        this.repository = new cancel_repository_1.CancelAppointmentRepository();
    }
    async execute(request) {
        const appointment = await this.repository.cancel(request);
        // Registrar log de cancelamento
        await logger_service_1.LoggerService.log('Cancelamento de agendamento', 'Agendamento', request.userId, `Agendamento ${appointment.id} cancelado pelo usuário`);
        return { appointment };
    }
}
exports.CancelAppointmentService = CancelAppointmentService;
//# sourceMappingURL=cancel.service.js.map