import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
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
      ],
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.toJSON() as IUser;
  }
}
