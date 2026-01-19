import { Op, WhereOptions, Sequelize } from 'sequelize';
import { LogModel } from '../model/log.model';
import { UserModel } from '@modules/users/model/user.model';
import { ILog } from '../model/log.interface';
import { IListLogsRequest } from '../use-cases/list/list.interface';

export class LogRepository {
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

    const hasActivityOrModule = filters.activityType || filters.module;
    const hasUserName = filters.userId === undefined && !!filters.userName;

    if (hasActivityOrModule && hasUserName) {
      const searchTerm = filters.activityType || filters.module || '';
      const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const userNameWords = filters
        .userName!.trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const wordConditions = searchWords.map((word) => {
        const orConditions: Array<WhereOptions> = [];

        if (filters.activityType) {
          orConditions.push({ activityType: { [Op.like]: `%${word}%` } });
        }
        if (filters.module) {
          orConditions.push({ module: { [Op.like]: `%${word}%` } });
        }

        userNameWords.forEach((userWord) => {
          const escapedWord = userWord.replace(/'/g, "''");
          orConditions.push(
            Sequelize.literal(
              `(user.first_name LIKE '%${escapedWord}%' OR user.last_name LIKE '%${escapedWord}%')`
            ) as WhereOptions
          );
        });

        if (orConditions.length === 0) {
          return {};
        }
        if (orConditions.length === 1) {
          return orConditions[0];
        }
        return { [Op.or]: orConditions };
      });

      if (wordConditions.length > 0) {
        (where as unknown as Record<string, unknown>)[
          Op.and as unknown as keyof typeof Op
        ] = wordConditions;
      }
    } else if (hasActivityOrModule) {
      const searchTerm = filters.activityType || filters.module || '';
      const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (searchWords.length > 0) {
        const wordConditions = searchWords.map((word) => {
          const orConditions: Array<WhereOptions> = [];

          if (filters.activityType) {
            orConditions.push({ activityType: { [Op.like]: `%${word}%` } });
          }
          if (filters.module) {
            orConditions.push({ module: { [Op.like]: `%${word}%` } });
          }

          if (orConditions.length === 0) {
            return {};
          }
          if (orConditions.length === 1) {
            return orConditions[0];
          }
          return { [Op.or]: orConditions };
        });

        if (wordConditions.length > 0) {
          (where as unknown as Record<string, unknown>)[
            Op.and as unknown as keyof typeof Op
          ] = wordConditions;
        }
      }
    }

    let userWhere: WhereOptions | undefined = undefined;
    if (hasUserName && !hasActivityOrModule) {
      const searchWords = filters
        .userName!.trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (searchWords.length > 0) {
        const wordConditions = searchWords.map((word) => ({
          [Op.or]: [
            { firstName: { [Op.like]: `%${word}%` } },
            { lastName: { [Op.like]: `%${word}%` } },
          ],
        }));

        userWhere = {
          [Op.and]: wordConditions,
        } as WhereOptions;
      }
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
          where: userWhere,
          required: (hasActivityOrModule && hasUserName) || hasUserName,
          attributes: {
            exclude: ['password'],
          },
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
