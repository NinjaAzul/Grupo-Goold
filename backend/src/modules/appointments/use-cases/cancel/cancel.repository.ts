import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { ICancelAppointmentRequest } from './cancel.interface';

export class CancelAppointmentRepository {
  async cancel(
    request: ICancelAppointmentRequest
  ): Promise<IAppointment | null> {
    const appointment = await AppointmentModel.findByPk(request.appointmentId, {
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
      return null;
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    return appointment.toJSON() as IAppointment;
  }
}
