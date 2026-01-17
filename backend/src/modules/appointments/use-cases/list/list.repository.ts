import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { IListAppointmentsRequest } from './list.interface';
import { Op, WhereOptions } from 'sequelize';

export class ListAppointmentsRepository {
  async list(
    filters: IListAppointmentsRequest
  ): Promise<{ rows: IAppointment[]; count: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {
      userId: filters.userId,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.appointmentDate = {};
      if (filters.startDate) {
        where.appointmentDate[Op.gte] = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.appointmentDate[Op.lte] = endDate;
      }
    }

    let userWhere: WhereOptions | undefined = undefined;
    if (filters.name) {
      const searchTerm = `%${filters.name}%`;
      userWhere = {
        [Op.or]: [
          { firstName: { [Op.like]: searchTerm } },
          { lastName: { [Op.like]: searchTerm } },
          { email: { [Op.like]: searchTerm } },
        ],
      };
    }

    const { rows, count } = await AppointmentModel.findAndCountAll({
      where,
      include: [
        {
          model: UserModel,
          as: 'user',
          where: userWhere,
          required: filters.name ? true : false,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
      limit,
      offset,
      order: [['appointmentDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => row.toJSON() as IAppointment),
      count,
    };
  }
}
