import { UserRepository } from '../../repositories/user.repository';
import { LoggerService } from '@shared/utils/logger.service';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { UserModel } from '@modules/users/model/user.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { ROLES } from '@/@shared/constants';

export class DeleteUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId: number): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (user.roleId === ROLES.ADMIN) {
      const adminCount = await UserModel.count({
        where: { roleId: ROLES.ADMIN },
      });

      if (adminCount === 1) {
        throw new BadRequestError(
          'Não é possível excluir o último usuário administrador. Deve existir pelo menos um administrador.'
        );
      }
    }

    const appointmentsCount = await AppointmentModel.count({
      where: { userId },
    });

    if (appointmentsCount > 0) {
      throw new BadRequestError(
        `Não é possível excluir o usuário. Existem ${appointmentsCount} agendamento(s) associados a este usuário.`
      );
    }

    const deleted = await this.userRepository.delete(userId);

    if (!deleted) {
      throw new NotFoundError('Usuário não encontrado');
    }

    await LoggerService.log(
      'Exclusão de usuário',
      'Minha Conta',
      userId,
      `Usuário ${user.email} foi excluído`
    );
  }
}
