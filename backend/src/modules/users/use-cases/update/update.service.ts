import { UpdateUserRepository } from './update.repository';
import { IUpdateUserRequest, IUpdateUserResponse } from './update.interface';
import { LoggerService } from '@shared/utils/logger.service';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { CityRepository } from '@modules/cities/use-cases/repositories/city.repository';
import { RoleRepository } from '@modules/roles/use-cases/repositories/role.repository';
import { UserModel } from '@modules/users/model/user.model';
import bcrypt from 'bcrypt';

export class UpdateUserService {
  private repository: UpdateUserRepository;
  private cityRepository: CityRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.repository = new UpdateUserRepository();
    this.cityRepository = new CityRepository();
    this.roleRepository = new RoleRepository();
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async execute(request: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    const existingUser = await UserModel.findByPk(request.userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    if (request.email && request.email !== existingUser.email) {
      const emailExists = await UserModel.findOne({
        where: { email: request.email },
      });

      if (emailExists) {
        throw new BadRequestError('Email already in use');
      }
    }

    if (request.cityId) {
      const city = await this.cityRepository.findById(request.cityId);
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    if (request.roleId) {
      const role = await this.roleRepository.findById(request.roleId);
      if (!role) {
        throw new NotFoundError('Role not found');
      }
    }

    const updateData = { ...request };
    if (request.password) {
      updateData.password = await this.hashPassword(request.password);
    }

    const user = await this.repository.update(updateData);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await LoggerService.log(
      'Atualização de perfil',
      'Minha Conta',
      user.id,
      `Usuário ${user.email} atualizou perfil`
    );

    return { user };
  }
}
