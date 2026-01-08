import { Op, WhereOptions } from 'sequelize';
import { LogModel } from '@modules/logs/model/log.model';
import { UserModel } from '@modules/users/model/user.model';
import { ILog } from '@modules/logs/model/log.interface';
import { IListLogsRequest } from './list.interface';

export class ListLogsRepository {
  async findAll(
    filters: IListLogsRequest
  ): Promise<{ logs: ILog[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (filters.userId !== undefined) {
      where.userId = filters.userId;
    }

    if (filters.activityType) {
      where.activityType = { [Op.like]: `%${filters.activityType}%` };
    }

    if (filters.module) {
      where.module = { [Op.like]: `%${filters.module}%` };
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt[Op.gte] = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt[Op.lte] = new Date(filters.endDate);
      }
    }

    const { count, rows } = await LogModel.findAndCountAll({
      where,
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
          required: false,
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      logs: rows.map((log) => log.toJSON() as ILog),
      total: count,
    };
  }
}
