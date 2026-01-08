import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { NotFoundError } from '@shared/errors';

export class UpdateStatusRepository {
  async updateStatus(
    appointmentId: number,
    status: AppointmentStatus
  ): Promise<IAppointment> {
    const appointment = await AppointmentModel.findByPk(appointmentId, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = status;
    await appointment.save();

    return appointment.toJSON() as IAppointment;
  }
}
