import { Op, WhereOptions, Sequelize } from 'sequelize';
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
    if (!data.roomId) {
      throw new Error('roomId is required');
    }

    const mysqlDateTime = data.appointmentDate
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    const appointment = await AppointmentModel.create({
      userId: data.userId,
      appointmentDate: Sequelize.literal(`'${mysqlDateTime}'`),
      roomId: data.roomId,
      status: AppointmentStatus.PENDING,
    } as unknown as IAppointment);

    const appointmentWithRelations = await AppointmentModel.findByPk(
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
          {
            model: RoomModel,
            as: 'room',
            required: true,
          },
        ],
      }
    );

    if (!appointmentWithRelations) {
      return null;
    }

    return appointmentWithRelations.toJSON() as IAppointment;
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
        {
          model: RoomModel,
          as: 'room',
          required: true,
        },
      ],
      limit,
      offset,
      order: [['appointmentDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => {
        const appointment = row.toJSON() as IAppointment;
        return appointment;
      }),
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
    let roomWhere: WhereOptions | undefined;

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
      roomWhere = {
        name: { [Op.like]: `%${filters.room}%` },
      };
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
        {
          model: RoomModel,
          as: 'room',
          where: roomWhere,
          required: true,
        },
      ],
      limit,
      offset,
      order: [['appointmentDate', 'DESC']],
    });

    return {
      appointments: rows.map((row) => row.toJSON() as IAppointment),
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
        {
          model: RoomModel,
          as: 'room',
          required: true,
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
        {
          model: RoomModel,
          as: 'room',
          required: true,
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
