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
      const dateFilter: any = {};
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

    // Mapear usuários e formatar permissões corretamente
    const users = rows.map((user) => {
      const userJson = user.toJSON() as any;

      // Formatar permissões para o formato esperado
      // Sequelize retorna através do through model como UserPermissionModel (nome do modelo)
      if (userJson.permissions && Array.isArray(userJson.permissions)) {
        userJson.permissions = userJson.permissions.map(
          (perm: Record<string, unknown>) => {
            // O Sequelize retorna o through model como UserPermissionModel (nome do modelo)
            // O MySQL retorna tinyint(1) como 0 ou 1, então precisamos converter para boolean
            let grantedValue = false;

            const userPermissionModel = perm.UserPermissionModel as
              | { granted?: boolean | number }
              | undefined;

            // Verificar e converter para boolean
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
      }

      return userJson as IUser;
    });

    return {
      users,
      total: count,
    };
  }
}
