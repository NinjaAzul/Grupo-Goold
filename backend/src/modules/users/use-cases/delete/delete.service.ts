import { DeleteUserRepository } from './delete.repository';
import { LoggerService } from '@shared/utils/logger.service';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { UserModel } from '@modules/users/model/user.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { ROLES } from '@/@shared/constants';

export class DeleteUserService {
  private repository: DeleteUserRepository;

  constructor() {
    this.repository = new DeleteUserRepository();
  }

  async execute(userId: number): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.roleId === ROLES.ADMIN) {
      const adminCount = await UserModel.count({
        where: { roleId: ROLES.ADMIN },
      });

      if (adminCount === 1) {
        throw new BadRequestError(
          'Cannot delete the last admin user. At least one admin must exist.'
        );
      }
    }

    const appointmentsCount = await AppointmentModel.count({
      where: { userId },
    });

    if (appointmentsCount > 0) {
      throw new BadRequestError(
        `Cannot delete user. There are ${appointmentsCount} appointment(s) associated with this user.`
      );
    }

    const deleted = await this.repository.delete(userId);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    await LoggerService.log(
      'Exclusão de usuário',
      'Minha Conta',
      userId,
      `Usuário ${user.email} foi excluído`
    );
  }
}
