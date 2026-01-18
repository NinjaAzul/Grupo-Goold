import { Op, WhereOptions } from 'sequelize';
import { AppointmentModel } from '../model/appointment.model';
import { UserModel } from '@modules/users/model/user.model';
import { RoomModel } from '@modules/rooms/model/room.model';
import {
  IAppointment,
  AppointmentStatus,
} from '../model/appointment.interface';
import { ICreateAppointmentRequest } from '../use-cases/create/create.interface';
import { IListAppointmentsRequest } from '../use-cases/list/list.interface';
import { AdminListAppointmentsQueryDto } from '../use-cases/admin-list/admin-list-query.dto';
import { ICancelAppointmentRequest } from '../use-cases/cancel/cancel.interface';

export class AppointmentRepository {
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
      return null;
    }

    return appointmentWithUser.toJSON() as IAppointment;
  }

  async findAll(
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

  async findAllAdmin(
    filters: AdminListAppointmentsQueryDto
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
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.appointmentDate[Op.lte] = endDate;
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

  async getRooms(roomId?: number): Promise<RoomModel[]> {
    const roomsWhere: { id?: number } = {};
    if (roomId) {
      roomsWhere.id = roomId;
    }

    return await RoomModel.findAll({
      where: roomsWhere,
    });
  }

  async updateStatus(
    appointmentId: number,
    status: AppointmentStatus
  ): Promise<IAppointment | null> {
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
      return null;
    }

    appointment.status = status;
    await appointment.save();

    return appointment.toJSON() as IAppointment;
  }

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
