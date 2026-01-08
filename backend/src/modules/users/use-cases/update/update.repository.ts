import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities/model/city.model';
import { IUser } from '@modules/users/model/user.interface';
import { IUpdateUserRequest } from './update.interface';
import { NotFoundError, BadRequestError } from '@shared/errors';
import bcrypt from 'bcrypt';

export class UpdateUserRepository {
  async update(data: IUpdateUserRequest): Promise<IUser> {
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
      throw new NotFoundError('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await UserModel.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new BadRequestError('Email already in use');
      }
    }

    if (data.cityId) {
      const city = await CityModel.findByPk(data.cityId);
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    if (data.roleId) {
      const role = await RoleModel.findByPk(data.roleId);
      if (!role) {
        throw new NotFoundError('Role not found');
      }
    }

    const updateData: Partial<IUser> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.roleId !== undefined) updateData.roleId = data.roleId;
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

    return updatedUser!.toJSON() as IUser;
  }
}
