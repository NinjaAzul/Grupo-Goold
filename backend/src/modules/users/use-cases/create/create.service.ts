import { CreateUserRepository } from './create.repository';
import { ICreateUserResponse } from './create.interface';
import { NotFoundError } from '@shared/errors';
import { RoleModel } from '@modules/roles';
import { CityModel } from '@modules/cities';
import { CreateUserDto } from './create.dto';

export class CreateUserService {
  private createUserRepository: CreateUserRepository;

  constructor() {
    this.createUserRepository = new CreateUserRepository();
  }

  async execute(request: CreateUserDto): Promise<ICreateUserResponse> {
    // Validação de negócio: verificar se a role existe (se fornecido)
    if (request.roleId) {
      const role = await RoleModel.findByPk(request.roleId);
      if (!role) {
        throw new NotFoundError('Role not found');
      }
    }

    // Validação de negócio: verificar se a city existe (se fornecido)
    if (request.cityId) {
      const city = await CityModel.findByPk(request.cityId);
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    const user = await this.createUserRepository.create(request);

    return { user };
  }
}
