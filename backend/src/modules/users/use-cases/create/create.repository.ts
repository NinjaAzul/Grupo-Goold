import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';
import { CreateUserDto } from './create.dto';
import { ROLES } from '@/@shared/constants';
import { PermissionModel } from '@modules/permissions';
import { UserPermissionModel } from '@modules/user-permissions';
import bcrypt from 'bcrypt';

export class CreateUserRepository {
  async create(data: CreateUserDto): Promise<IUser> {
    const user = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      roleId: data.roleId || ROLES.USER,
      active: true, // Usuário criado já vem ativo
      zipCode: data.zipCode || null,
      street: data.street || null,
      number: data.number || null,
      complement: data.complement || null,
      neighborhood: data.neighborhood || null,
      cityId: data.cityId || null,
    });

    // Buscar permissões LOGS e APPOINTMENTS
    const permissions = await PermissionModel.findAll({
      where: {
        name: ['LOGS', 'APPOINTMENTS'],
      },
    });

    // Criar permissões para o usuário (todas ativas por padrão)
    if (permissions.length > 0) {
      const userPermissions = permissions.map((permission) => ({
        userId: user.id,
        permissionId: permission.id,
        granted: true,
      }));

      await UserPermissionModel.bulkCreate(userPermissions);
    }

    // Buscar usuário com permissões para retornar
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
      throw new Error('Failed to create user');
    }

    // Formatar permissões para o formato esperado
    const userJson = userWithPermissions.toJSON() as unknown as Record<
      string,
      unknown
    >;
    if (userJson.permissions && Array.isArray(userJson.permissions)) {
      userJson.permissions = userJson.permissions.map(
        (perm: Record<string, unknown>) => ({
          permission: {
            id: perm.id,
            name: perm.name,
          },
          granted:
            (perm.user_permissions as { granted?: boolean })?.granted ??
            (perm.granted as boolean) ??
            false,
        })
      );
    }

    return userJson as unknown as IUser;
  }
}
