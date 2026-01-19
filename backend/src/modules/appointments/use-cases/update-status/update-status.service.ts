import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  IUpdateStatusRequest,
  IUpdateStatusResponse,
} from './update-status.interface';
import { LoggerService } from '@shared/utils/logger.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { NotFoundError } from '@shared/errors';
import { DateHelper } from '@shared/utils/date.helper';

export class UpdateStatusService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  async execute(request: IUpdateStatusRequest): Promise<IUpdateStatusResponse> {
    const appointment = await this.appointmentRepository.updateStatus(
      request.appointmentId,
      request.status
    );

    if (!appointment) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    let activityType = 'Atualização de agendamento';
    if (request.status === AppointmentStatus.SCHEDULED) {
      activityType = 'Criação de agendamento';
    } else if (request.status === AppointmentStatus.CANCELLED) {
      activityType = 'Cancelamento de agendamento';
    }

    const logUserId = request.adminUserId ?? appointment.userId;
    await LoggerService.log(
      activityType,
      'Agendamento',
      logUserId,
      `Agendamento ${appointment.id} - Status: ${request.status}${request.adminUserId ? ` (Ação realizada por admin)` : ''}`
    );

    return { appointment: DateHelper.normalizeDatesInObject(appointment) };
  }
}
