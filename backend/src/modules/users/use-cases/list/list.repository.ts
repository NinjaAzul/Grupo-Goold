import { Op, WhereOptions } from 'sequelize';
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { PermissionModel } from '@modules/permissions';
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

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.startDate || filters.endDate) {
      const dateFilter: {
        [Op.gte]?: Date;
        [Op.lte]?: Date;
      } = {};
      if (filters.startDate) {
        dateFilter[Op.gte] = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        dateFilter[Op.lte] = endDate;
      }
      if (Object.keys(dateFilter).length > 0) {
        where.createdAt = dateFilter;
      }
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
        {
          model: PermissionModel,
          as: 'permissions',
          through: {
            attributes: ['granted'],
          },
          attributes: ['id', 'name'],
        },
      ],
      attributes: {
        exclude: ['password'],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const users = rows.map((user) => {
      type UserJsonWithPermissions = Record<string, unknown> & {
        permissions?: Array<{
          id: number;
          name: string;
          UserPermissionModel?: { granted?: boolean | number };
        }>;
      };

      const userJson = user.toJSON() as UserJsonWithPermissions;

      if (userJson.permissions && Array.isArray(userJson.permissions)) {
        const formattedPermissions = userJson.permissions.map(
          (perm: Record<string, unknown>) => {
            let grantedValue = false;

            const userPermissionModel = perm.UserPermissionModel as
              | { granted?: boolean | number }
              | undefined;

            if (userPermissionModel?.granted !== undefined) {
              grantedValue = Boolean(userPermissionModel.granted);
            }

            return {
              permission: {
                id: perm.id as number,
                name: perm.name as string,
              },
              granted: grantedValue,
            };
          }
        );

        return {
          ...userJson,
          permissions: formattedPermissions,
        } as unknown as IUser;
      }

      return userJson as unknown as IUser;
    });

    return {
      users,
      total: count,
    };
  }
}
