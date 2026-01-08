import { UpdateStatusRepository } from './update-status.repository';
import {
  IUpdateStatusRequest,
  IUpdateStatusResponse,
} from './update-status.interface';
import { LoggerService } from '@shared/utils/logger.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';

export class UpdateStatusService {
  private repository: UpdateStatusRepository;

  constructor() {
    this.repository = new UpdateStatusRepository();
  }

  async execute(request: IUpdateStatusRequest): Promise<IUpdateStatusResponse> {
    const appointment = await this.repository.updateStatus(
      request.appointmentId,
      request.status
    );

    // Determinar tipo de atividade baseado no status
    let activityType = 'Atualização de agendamento';
    if (request.status === AppointmentStatus.SCHEDULED) {
      activityType = 'Criação de agendamento';
    } else if (request.status === AppointmentStatus.CANCELLED) {
      activityType = 'Cancelamento de agendamento';
    }

    // Registrar log
    await LoggerService.log(
      activityType,
      'Agendamento',
      appointment.userId,
      `Agendamento ${appointment.id} - Status: ${request.status}`
    );

    return { appointment };
  }
}
