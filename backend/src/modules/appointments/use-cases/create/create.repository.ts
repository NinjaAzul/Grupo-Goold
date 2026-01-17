import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { ICreateAppointmentRequest } from './create.interface';

export class CreateAppointmentRepository {
  async create(data: ICreateAppointmentRequest): Promise<IAppointment | null> {
    const appointment = await AppointmentModel.create({
      userId: data.userId,
      appointmentDate: data.appointmentDate,
      room: data.room,
      status: AppointmentStatus.PENDING,
    } as IAppointment);

    const appointmentWithUser = await AppointmentModel.findByPk(
      appointment.id,
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

    if (!appointmentWithUser) {
      return null as unknown as IAppointment;
    }

    return appointmentWithUser.toJSON() as IAppointment;
  }
}
