"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusService = void 0;
const update_status_repository_1 = require("./update-status.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
class UpdateStatusService {
    constructor() {
        this.repository = new update_status_repository_1.UpdateStatusRepository();
    }
    async execute(request) {
        const appointment = await this.repository.updateStatus(request.appointmentId, request.status);
        // Determinar tipo de atividade baseado no status
        let activityType = 'Atualização de agendamento';
        if (request.status === appointment_interface_1.AppointmentStatus.SCHEDULED) {
            activityType = 'Criação de agendamento';
        }
        else if (request.status === appointment_interface_1.AppointmentStatus.CANCELLED) {
            activityType = 'Cancelamento de agendamento';
        }
        // Registrar log
        // Quando um admin realiza a ação, usar o ID do admin, senão usar o ID do dono do agendamento
        const logUserId = request.adminUserId ?? appointment.userId;
        await logger_service_1.LoggerService.log(activityType, 'Agendamento', logUserId, `Agendamento ${appointment.id} - Status: ${request.status}${request.adminUserId ? ` (Ação realizada por admin)` : ''}`);
        return { appointment };
    }
}
exports.UpdateStatusService = UpdateStatusService;
//# sourceMappingURL=update-status.service.js.map