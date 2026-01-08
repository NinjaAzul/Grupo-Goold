import { DeleteUserRepository } from './delete.repository';
import { LoggerService } from '@shared/utils/logger.service';
import { UserModel } from '@modules/users/model/user.model';

export class DeleteUserService {
  private repository: DeleteUserRepository;

  constructor() {
    this.repository = new DeleteUserRepository();
  }

  async execute(userId: number): Promise<void> {
    // Buscar dados do usuário antes de deletar para o log
    const user = await UserModel.findByPk(userId);
    const userEmail = user?.email || 'N/A';

    await this.repository.delete(userId);

    // Registrar log de deleção (sem userId pois o usuário foi deletado)
    await LoggerService.log(
      'Exclusão de usuário',
      'Minha Conta',
      null,
      `Usuário ${userEmail} foi excluído`
    );
  }
}
