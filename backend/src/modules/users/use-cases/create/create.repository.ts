import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';
import { CreateUserDto } from './create.dto';
import { ROLES } from '@/@shared/constants';
import bcrypt from 'bcrypt';

export class CreateUserRepository {
  async create(data: CreateUserDto): Promise<IUser> {
    const user = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      roleId: ROLES.USER,
      zipCode: data.zipCode || null,
      street: data.street || null,
      number: data.number || null,
      complement: data.complement || null,
      neighborhood: data.neighborhood || null,
      cityId: data.cityId || null,
    });

    return user.toJSON() as IUser;
  }
}
