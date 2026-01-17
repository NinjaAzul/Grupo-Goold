import { CreateUserRepository } from './create.repository';
import { ICreateUserResponse } from './create.interface';
import { NotFoundError } from '@shared/errors';
import { CityRepository } from '@modules/cities/use-cases/repositories/city.repository';
import { CreateUserDto } from './create.dto';
import { LoggerService } from '@shared/utils/logger.service';
import bcrypt from 'bcrypt';
import { IUser } from '../../model/user.interface';

export class CreateUserService {
  private createUserRepository: CreateUserRepository;
  private cityRepository: CityRepository;

  constructor() {
    this.createUserRepository = new CreateUserRepository();
    this.cityRepository = new CityRepository();
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async formatUserPermissions(user: IUser): Promise<IUser> {
    const userJson = user as unknown as Record<string, unknown>;
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

  async execute(request: CreateUserDto): Promise<ICreateUserResponse> {
    if (request.cityId) {
      const city = await this.cityRepository.findById(request.cityId);
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    const hashedPassword = await this.hashPassword(request.password);

    const user = await this.createUserRepository.create({
      ...request,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    const formattedUser = await this.formatUserPermissions(user);

    await LoggerService.log(
      'Criação de usuário',
      'Minha Conta',
      formattedUser.id,
      `Usuário ${formattedUser.email} foi criado`
    );

    return { user: formattedUser };
  }
}
