import { CancelAppointmentRepository } from './cancel.repository';
import {
  ICancelAppointmentRequest,
  ICancelAppointmentResponse,
} from './cancel.interface';
import { LoggerService } from '@shared/utils/logger.service';

export class CancelAppointmentService {
  private repository: CancelAppointmentRepository;

  constructor() {
    this.repository = new CancelAppointmentRepository();
  }

  async execute(
    request: ICancelAppointmentRequest
  ): Promise<ICancelAppointmentResponse> {
    const appointment = await this.repository.cancel(request);

    // Registrar log de cancelamento
    await LoggerService.log(
      'Cancelamento de agendamento',
      'Agendamento',
      request.userId,
      `Agendamento ${appointment.id} cancelado pelo usuário`
    );

    return { appointment };
  }
}

