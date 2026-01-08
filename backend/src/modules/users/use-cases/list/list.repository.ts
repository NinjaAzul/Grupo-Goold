import { Op, WhereOptions } from 'sequelize';
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { IUser } from '@modules/users/model/user.interface';
import { IListUsersRequest } from './list.interface';

export class ListUsersRepository {
  async findAll(
    filters: IListUsersRequest
  ): Promise<{ users: IUser[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (filters.name) {
      where[Op.or as unknown as keyof typeof Op] = [
        { firstName: { [Op.like]: `%${filters.name}%` } },
        { lastName: { [Op.like]: `%${filters.name}%` } },
      ];
    }

    if (filters.email) {
      where.email = { [Op.like]: `%${filters.email}%` };
    }

    if (filters.roleId) {
      where.roleId = filters.roleId;
    }

    if (filters.cityId) {
      where.cityId = filters.cityId;
    }

    const { count, rows } = await UserModel.findAndCountAll({
      where,
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
        {
          model: CityModel,
          as: 'city',
        },
      ],
      attributes: {
        exclude: ['password'],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows.map((user) => user.toJSON() as IUser),
      total: count,
    };
  }
}
