import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { NotFoundError, ForbiddenError } from '@shared/errors';
import { ICancelAppointmentRequest } from './cancel.interface';

export class CancelAppointmentRepository {
  async cancel(
    request: ICancelAppointmentRequest
  ): Promise<IAppointment> {
    const appointment = await AppointmentModel.findByPk(
      request.appointmentId,
      {
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: {
              exclude: ['password'],
            },
          },
        ],
      }
    );

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    // Verificar se o usuário é o dono do agendamento
    if (appointment.userId !== request.userId) {
      throw new ForbiddenError(
        'You can only cancel your own appointments'
      );
    }

    // Verificar se já está cancelado
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new ForbiddenError('Appointment is already cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    return appointment.toJSON() as IAppointment;
  }
}

