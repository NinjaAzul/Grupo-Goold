import { Op, WhereOptions } from 'sequelize';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { IListAppointmentsRequest } from './list.interface';

export class ListAppointmentsRepository {
  async findAll(
    filters: IListAppointmentsRequest
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    let userWhere: WhereOptions | undefined;

    if (filters.name) {
      userWhere = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${filters.name}%` } },
          { lastName: { [Op.like]: `%${filters.name}%` } },
          { email: { [Op.like]: `%${filters.name}%` } },
        ],
      };
    }

    if (filters.room) {
      where.room = { [Op.like]: `%${filters.room}%` };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.appointmentDate = {};
      if (filters.startDate) {
        where.appointmentDate[Op.gte] = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.appointmentDate[Op.lte] = new Date(filters.endDate);
      }
    }

    const { count, rows } = await AppointmentModel.findAndCountAll({
      where,
      include: [
        {
          model: UserModel,
          as: 'user',
          where: userWhere,
          attributes: {
            exclude: ['password'],
          },
          required: !!userWhere,
        },
      ],
      limit,
      offset,
      order: [['appointmentDate', 'DESC']],
    });

    return {
      appointments: rows.map(
        (appointment) => appointment.toJSON() as IAppointment
      ),
      total: count,
    };
  }
}
