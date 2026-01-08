import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';
import { CreateUserDto } from './create.dto';

export class CreateUserRepository {
  async create(data: CreateUserDto): Promise<IUser> {
    const user = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      roleId: data.roleId || 2, // Default para USER (id 2)
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
