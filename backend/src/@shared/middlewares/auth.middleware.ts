import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '@shared/errors';
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
// Importar models para garantir que as associações estejam carregadas
import '@infra/database/models';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token not provided');
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new UnauthorizedError('Token not provided');
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
      ],
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new UnauthorizedError('User does not exist');
    }

    req.user = user.toJSON();
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid token');
  }
}
