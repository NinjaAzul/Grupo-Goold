import { CreateUserRepository } from './create.repository';
import { ICreateUserResponse } from './create.interface';
import { NotFoundError } from '@shared/errors';
import { CityModel } from '@modules/cities';
import { CreateUserDto } from './create.dto';
import { LoggerService } from '@shared/utils/logger.service';

export class CreateUserService {
  private createUserRepository: CreateUserRepository;

  constructor() {
    this.createUserRepository = new CreateUserRepository();
  }

  async execute(request: CreateUserDto): Promise<ICreateUserResponse> {
    if (request.cityId) {
      const city = await CityModel.findByPk(request.cityId);
      if (!city) {
        throw new NotFoundError('City not found');
      }
    }

    const user = await this.createUserRepository.create(request);

    // Registrar log de criação de usuário
    await LoggerService.log(
      'Criação de usuário',
      'Minha Conta',
      user.id,
      `Usuário ${user.email} foi criado`
    );

    return { user };
  }
}
