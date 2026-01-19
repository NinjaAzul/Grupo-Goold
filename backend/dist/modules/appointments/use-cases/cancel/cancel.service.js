"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const errors_1 = require("@shared/errors");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
const date_helper_1 = require("@shared/utils/date.helper");
class CancelAppointmentService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async execute(request) {
        const appointment = await appointment_model_1.AppointmentModel.findByPk(request.appointmentId);
        if (!appointment) {
            throw new errors_1.NotFoundError('Agendamento não encontrado');
        }
        if (appointment.userId !== request.userId) {
            throw new errors_1.UnauthorizedError('Você só pode cancelar seus próprios agendamentos');
        }
        if (appointment.status === appointment_interface_1.AppointmentStatus.CANCELLED) {
            throw new errors_1.BadRequestError('O agendamento já está cancelado');
        }
        const cancelledAppointment = await this.appointmentRepository.cancel(request);
        if (!cancelledAppointment) {
            throw new errors_1.NotFoundError('Agendamento não encontrado');
        }
        await logger_service_1.LoggerService.log('Cancelamento de agendamento', 'Agendamento', request.userId, `Agendamento ${cancelledAppointment.id} cancelado pelo usuário`);
        return {
            appointment: date_helper_1.DateHelper.normalizeDatesInObject(cancelledAppointment),
        };
    }
}
exports.CancelAppointmentService = CancelAppointmentService;
//# sourceMappingURL=cancel.service.js.map