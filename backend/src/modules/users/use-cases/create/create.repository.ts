import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';
import { CreateUserDto } from './create.dto';
import { ROLES } from '@/@shared/constants';
import { PermissionModel } from '@modules/permissions';
import { UserPermissionModel } from '@modules/user-permissions';

export interface CreateUserRepositoryData extends Omit<
  CreateUserDto,
  'password'
> {
  password: string;
}

export class CreateUserRepository {
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

    return userWithPermissions.toJSON() as IUser;
  }
}
