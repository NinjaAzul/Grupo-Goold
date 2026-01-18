import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  ICancelAppointmentRequest,
  ICancelAppointmentResponse,
} from './cancel.interface';
import { LoggerService } from '@shared/utils/logger.service';
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '@shared/errors';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';

export class CancelAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  async execute(
    request: ICancelAppointmentRequest
  ): Promise<ICancelAppointmentResponse> {
    const appointment = await AppointmentModel.findByPk(request.appointmentId);

    if (!appointment) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    if (appointment.userId !== request.userId) {
      throw new UnauthorizedError(
        'Você só pode cancelar seus próprios agendamentos'
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestError('O agendamento já está cancelado');
    }

    const cancelledAppointment =
      await this.appointmentRepository.cancel(request);

    if (!cancelledAppointment) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    await LoggerService.log(
      'Cancelamento de agendamento',
      'Agendamento',
      request.userId,
      `Agendamento ${cancelledAppointment.id} cancelado pelo usuário`
    );

    return { appointment: cancelledAppointment };
  }
}
