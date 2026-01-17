import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';
import { PermissionModel } from '@modules/permissions';

export class LoginRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      where: { email },
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
    });

    if (!user) {
      return null;
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
