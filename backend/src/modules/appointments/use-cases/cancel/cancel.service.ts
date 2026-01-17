import { CancelAppointmentRepository } from './cancel.repository';
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
  private repository: CancelAppointmentRepository;

  constructor() {
    this.repository = new CancelAppointmentRepository();
  }

  async execute(
    request: ICancelAppointmentRequest
  ): Promise<ICancelAppointmentResponse> {
    const appointment = await AppointmentModel.findByPk(request.appointmentId);

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    if (appointment.userId !== request.userId) {
      throw new UnauthorizedError('You can only cancel your own appointments');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestError('Appointment is already cancelled');
    }

    const cancelledAppointment = await this.repository.cancel(request);

    if (!cancelledAppointment) {
      throw new NotFoundError('Appointment not found');
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
