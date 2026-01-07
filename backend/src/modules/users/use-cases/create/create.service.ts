import { CreateUserRepository } from './create.repository';
import { ICreateUserResponse } from './create.interface';
import { NotFoundError } from '@shared/errors';
import { RoleModel } from '@modules/roles';
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

    const user = await this.createUserRepository.create(request);

    return { user };
  }
}
