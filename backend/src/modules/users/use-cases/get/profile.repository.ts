import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { PermissionModel } from '@modules/permissions';
import { IUser } from '@modules/users/model/user.interface';
import { NotFoundError } from '@shared/errors';

export class GetProfileRepository {
  async findById(userId: number): Promise<IUser> {
    const user = await UserModel.findByPk(userId, {
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
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userJson = user.toJSON() as unknown as Record<string, unknown>;
    if (userJson.permissions && Array.isArray(userJson.permissions)) {
      userJson.permissions = userJson.permissions.map(
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
              id: perm.id,
              name: perm.name,
            },
            granted: grantedValue,
          };
        }
      );
    }

    return userJson as unknown as IUser;
  }
}
