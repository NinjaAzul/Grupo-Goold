import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { IUser } from '@modules/users/model/user.interface';
import { IUpdateUserRequest } from './update.interface';

export interface UpdateUserRepositoryData extends IUpdateUserRequest {
  password?: string;
}

export class UpdateUserRepository {
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
}
