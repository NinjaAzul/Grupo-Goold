import { UpdateUserRepository } from './update.repository';
import { IUpdateUserRequest, IUpdateUserResponse } from './update.interface';
import { LoggerService } from '@shared/utils/logger.service';

export class UpdateUserService {
  private repository: UpdateUserRepository;

  constructor() {
    this.repository = new UpdateUserRepository();
  }

  async execute(request: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    const user = await this.repository.update(request);

    // Determinar tipo de atividade baseado no que foi alterado
    let activityType = 'Atualização de perfil';
    if (request.email) {
      activityType = 'Atualização de e-mail';
    } else if (request.password) {
      activityType = 'Atualização de senha';
    }

    // Registrar log de atualização
    await LoggerService.log(
      activityType,
      'Minha Conta',
      user.id,
      `Usuário ${user.email} atualizou ${activityType.toLowerCase()}`
    );

    return { user };
  }
}
