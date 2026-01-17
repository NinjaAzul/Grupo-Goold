import { CreateAppointmentRepository } from './create.repository';
import {
  ICreateAppointmentRequest,
  ICreateAppointmentResponse,
} from './create.interface';
import { LoggerService } from '@shared/utils/logger.service';

export class CreateAppointmentService {
  private repository: CreateAppointmentRepository;

  constructor() {
    this.repository = new CreateAppointmentRepository();
  }

  async execute(
    request: ICreateAppointmentRequest
  ): Promise<ICreateAppointmentResponse> {
    const appointment = await this.repository.create(request);

    if (!appointment) {
      throw new Error('Failed to create appointment');
    }

    await LoggerService.log(
      'Criação de agendamento',
      'Agendamento',
      request.userId,
      `Agendamento ${appointment.id} criado - Sala: ${request.room}, Data: ${request.appointmentDate}`
    );

    return { appointment };
  }
}
