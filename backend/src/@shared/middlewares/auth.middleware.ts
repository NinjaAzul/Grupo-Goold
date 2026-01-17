import '@infra/database/models';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '@shared/errors';
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { PermissionModel } from '@modules/permissions';
import { IUser } from '@/modules/users';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new UnauthorizedError('Token not provided'));
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return next(new UnauthorizedError('Token not provided'));
    }

    try {
      const { sub: id } = verify(
        token,
        process.env.JWT_SECRET as string
      ) as IPayload;

      const user = await UserModel.findByPk(id, {
        include: [
          {
            model: RoleModel,
            as: 'role',
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
          include: ['roleId'],
        },
      });

      if (!user) {
        return next(new UnauthorizedError('User does not exist'));
      }

      const userJson = user.toJSON() as unknown as Record<string, unknown>;
      if (userJson.permissions && Array.isArray(userJson.permissions)) {
        userJson.permissions = userJson.permissions.map(
          (perm: Record<string, unknown>) => {
            const userPermissionModel = perm.UserPermissionModel as
              | { granted?: boolean | number }
              | undefined;

            let grantedValue = false;
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

      const formattedUser = userJson as unknown as IUser;
      if (!formattedUser.roleId) {
        const userJsonAny = userJson as unknown as Record<string, unknown>;
        if (userJsonAny.role_id) {
          formattedUser.roleId = userJsonAny.role_id as number;
        } else if (formattedUser.role?.id) {
          formattedUser.roleId = formattedUser.role.id;
        }
      }

      req.user = formattedUser;
      req.token = token;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return next(error);
      }
      return next(new UnauthorizedError('Invalid token'));
    }
  } catch (error) {
    return next(error);
  }
}
