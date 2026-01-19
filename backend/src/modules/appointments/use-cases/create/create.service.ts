import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  ICreateAppointmentRequest,
  ICreateAppointmentResponse,
} from './create.interface';
import { LoggerService } from '@shared/utils/logger.service';
import { DateHelper } from '@shared/utils/date.helper';

export class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  async execute(
    request: ICreateAppointmentRequest
  ): Promise<ICreateAppointmentResponse> {
    const appointment = await this.appointmentRepository.create(request);

    if (!appointment) {
      throw new Error('Falha ao criar agendamento');
    }

    await LoggerService.log(
      'Criação de agendamento',
      'Agendamento',
      request.userId,
      `Agendamento ${appointment.id} criado - Sala: ${request.room}, Data: ${request.appointmentDate}`
    );

    return { appointment: DateHelper.normalizeDatesInObject(appointment) };
  }
}
