import { Op, WhereOptions } from 'sequelize';
import { UserModel } from '../model/user.model';
import { IUser } from '../model/user.interface';
import { ROLES } from '@/@shared/constants';
import { PermissionModel } from '@modules/permissions';
import { UserPermissionModel } from '@modules/user-permissions';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { CreateUserDto } from '../use-cases/create/create.dto';
import { IListUsersRequest } from '../use-cases/list/list.interface';
import { IUpdateUserRequest } from '../use-cases/update/update.interface';

export interface CreateUserRepositoryData extends Omit<
  CreateUserDto,
  'password'
> {
  password: string;
}

export interface UpdateUserRepositoryData extends IUpdateUserRequest {
  password?: string;
}

export interface FindUserOptions {
  includeRole?: boolean;
  includeCity?: boolean;
  includePermissions?: boolean;
  excludePassword?: boolean;
}

export class UserRepository {
  private formatPermissions(user: UserModel): IUser['permissions'] {
    const userJson = user.toJSON() as unknown as Record<string, unknown>;
    if (userJson.permissions && Array.isArray(userJson.permissions)) {
      return userJson.permissions.map((perm: Record<string, unknown>) => {
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
      });
    }
    return undefined;
  }

  async create(data: CreateUserRepositoryData): Promise<IUser | null> {
    const user = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      roleId: ROLES.USER,
      active: true,
      zipCode: data.zipCode || null,
      street: data.street || null,
      number: data.number || null,
      complement: data.complement || null,
      neighborhood: data.neighborhood || null,
      cityId: data.cityId || null,
    });

    const permissions = await PermissionModel.findAll({
      where: {
        name: ['LOGS', 'APPOINTMENTS'],
      },
    });

    if (permissions.length > 0) {
      const userPermissions = permissions.map((permission) => ({
        userId: user.id,
        permissionId: permission.id,
        granted: true,
      }));

      await UserPermissionModel.bulkCreate(userPermissions);
    }

    const userWithPermissions = await UserModel.findByPk(user.id, {
      include: [
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
    });

    if (!userWithPermissions) {
      return null;
    }

    const userJson = userWithPermissions.toJSON() as unknown as IUser;
    const formattedPermissions = this.formatPermissions(userWithPermissions);

    return {
      ...userJson,
      permissions: formattedPermissions,
    } as IUser;
  }

  async findAll(
    filters: IListUsersRequest
  ): Promise<{ users: IUser[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (filters.name) {
      const searchWords = filters.name
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (searchWords.length > 0) {
        const wordConditions = searchWords.map((word) => ({
          [Op.or]: [
            { firstName: { [Op.like]: `%${word}%` } },
            { lastName: { [Op.like]: `%${word}%` } },
          ],
        }));

        (where as unknown as Record<string, unknown>)[
          Op.and as unknown as keyof typeof Op
        ] = wordConditions;
      }
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
      const userJson = user.toJSON() as unknown as IUser;
      const formattedPermissions = this.formatPermissions(user);

      return {
        ...userJson,
        permissions: formattedPermissions,
      } as IUser;
    });

    return {
      users,
      total: count,
    };
  }

  async findById(
    userId: number,
    options: FindUserOptions = {
      includeRole: true,
      includeCity: true,
      includePermissions: true,
      excludePassword: true,
    }
  ): Promise<IUser | null> {
    const include = [];

    if (options.includeRole) {
      include.push({
        model: RoleModel,
        as: 'role',
      });
    }

    if (options.includeCity) {
      include.push({
        model: CityModel,
        as: 'city',
      });
    }

    if (options.includePermissions) {
      include.push({
        model: PermissionModel,
        as: 'permissions',
        through: {
          attributes: ['granted'],
        },
        attributes: ['id', 'name'],
      });
    }

    const user = await UserModel.findByPk(userId, {
      include,
      attributes: options.excludePassword
        ? {
            exclude: ['password'],
          }
        : undefined,
    });

    if (!user) {
      return null;
    }

    const userJson = user.toJSON() as unknown as IUser;
    const formattedPermissions = options.includePermissions
      ? this.formatPermissions(user)
      : undefined;

    return {
      ...userJson,
      permissions: formattedPermissions,
    } as IUser;
  }

  async findByEmail(
    email: string,
    options: FindUserOptions = {
      includePermissions: true,
      excludePassword: false,
    }
  ): Promise<IUser | null> {
    const include = [];

    if (options.includePermissions) {
      include.push({
        model: PermissionModel,
        as: 'permissions',
        through: {
          attributes: ['granted'],
        },
        attributes: ['id', 'name'],
      });
    }

    const user = await UserModel.findOne({
      where: { email },
      include,
      attributes: options.excludePassword
        ? {
            exclude: ['password'],
          }
        : undefined,
    });

    if (!user) {
      return null;
    }

    const userJson = user.toJSON() as unknown as IUser;
    const formattedPermissions = options.includePermissions
      ? this.formatPermissions(user)
      : undefined;

    return {
      ...userJson,
      permissions: formattedPermissions,
    } as IUser;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await UserModel.findOne({
      where: { email },
      attributes: ['id'],
    });

    return !!user;
  }

  async update(data: UpdateUserRepositoryData): Promise<IUser | null> {
    const user = await UserModel.findByPk(data.userId, {
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
    });

    if (!user) {
      return null;
    }

    const updateData: Partial<IUser> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.roleId !== undefined) updateData.roleId = data.roleId;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode || null;
    if (data.street !== undefined) updateData.street = data.street || null;
    if (data.number !== undefined) updateData.number = data.number || null;
    if (data.complement !== undefined)
      updateData.complement = data.complement || null;
    if (data.neighborhood !== undefined)
      updateData.neighborhood = data.neighborhood || null;
    if (data.cityId !== undefined) updateData.cityId = data.cityId || null;

    await user.update(updateData);

    const updatedUser = await UserModel.findByPk(data.userId, {
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
    });

    return updatedUser ? (updatedUser.toJSON() as IUser) : null;
  }

  async delete(userId: number): Promise<boolean> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }
}
