"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
const errors_1 = require("@shared/errors");
class UpdateStatusService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(request) {
        const appointment = await this.appointmentRepository.updateStatus(request.appointmentId, request.status);
        if (!appointment) {
            throw new errors_1.NotFoundError('Agendamento não encontrado');
        }
        let activityType = 'Atualização de agendamento';
        if (request.status === appointment_interface_1.AppointmentStatus.SCHEDULED) {
            activityType = 'Criação de agendamento';
        }
        else if (request.status === appointment_interface_1.AppointmentStatus.CANCELLED) {
            activityType = 'Cancelamento de agendamento';
        }
        const logUserId = request.adminUserId ?? appointment.userId;
        await logger_service_1.LoggerService.log(activityType, 'Agendamento', logUserId, `Agendamento ${appointment.id} - Status: ${request.status}${request.adminUserId ? ` (Ação realizada por admin)` : ''}`);
        return { appointment };
    }
}
exports.UpdateStatusService = UpdateStatusService;
//# sourceMappingURL=update-status.service.js.map