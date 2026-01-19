import { UserRepository } from '../../repositories/user.repository';
import { IUpdateUserRequest, IUpdateUserResponse } from './update.interface';
import { LoggerService } from '@shared/utils/logger.service';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { CityRepository } from '@modules/cities/repositories/city.repository';
import { RoleRepository } from '@/modules/roles/repositories/role.repository';
import { UserModel } from '@modules/users/model/user.model';
import { DateHelper } from '@shared/utils/date.helper';
import bcrypt from 'bcrypt';

export class UpdateUserService {
  private userRepository: UserRepository;
  private cityRepository: CityRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.cityRepository = new CityRepository();
    this.roleRepository = new RoleRepository();
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async execute(request: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    const existingUser = await UserModel.findByPk(request.userId);

    if (!existingUser) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (request.email && request.email !== existingUser.email) {
      const emailExists = await this.userRepository.emailExists(request.email);

      if (emailExists) {
        throw new BadRequestError('Este e-mail já está em uso');
      }
    }

    if (request.cityId) {
      const city = await this.cityRepository.findById(request.cityId);
      if (!city) {
        throw new NotFoundError('Cidade não encontrada');
      }
    }

    if (request.roleId) {
      const role = await this.roleRepository.findById(request.roleId);
      if (!role) {
        throw new NotFoundError('Perfil não encontrado');
      }
    }

    const updateData = { ...request };
    if (request.password) {
      updateData.password = await this.hashPassword(request.password);
    }

    const user = await this.userRepository.update(updateData);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    await LoggerService.log(
      'Atualização de perfil',
      'Minha Conta',
      user.id,
      `Usuário ${user.email} atualizou perfil`
    );

    return { user: DateHelper.normalizeDatesInObject(user) };
  }
}
