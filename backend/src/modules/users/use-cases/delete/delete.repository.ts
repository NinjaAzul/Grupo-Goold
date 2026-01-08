import { UserModel } from '@modules/users/model/user.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { ROLES } from '@shared/constants';

export class DeleteUserRepository {
  async delete(userId: number): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Não permitir deletar o último admin
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

    // Verificar se há agendamentos associados
    const appointmentsCount = await AppointmentModel.count({
      where: { userId },
    });

    if (appointmentsCount > 0) {
      throw new BadRequestError(
        `Cannot delete user. There are ${appointmentsCount} appointment(s) associated with this user.`
      );
    }

    await user.destroy();
  }
}
