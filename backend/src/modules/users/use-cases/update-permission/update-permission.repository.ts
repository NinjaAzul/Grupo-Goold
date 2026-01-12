import { UserPermissionModel } from '@modules/user-permissions';
import { PermissionModel } from '@modules/permissions';
import { UserModel } from '@modules/users/model/user.model';
import { NotFoundError } from '@shared/errors';
import { IUpdateUserPermissionRequest } from './update-permission.interface';

export class UpdateUserPermissionRepository {
  async update(data: IUpdateUserPermissionRequest): Promise<void> {
    // Verificar se o usuário existe
    const user = await UserModel.findByPk(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verificar se a permissão existe
    const permission = await PermissionModel.findByPk(data.permissionId);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // Buscar a relação user_permission existente
    const userPermission = await UserPermissionModel.findOne({
      where: {
        userId: data.userId,
        permissionId: data.permissionId,
      },
    });

    // Se não existir, criar
    if (!userPermission) {
      await UserPermissionModel.create({
        userId: data.userId,
        permissionId: data.permissionId,
        granted: data.granted,
      });
    } else {
      // Se já existia, atualizar
      await userPermission.update({ granted: data.granted });
      await userPermission.reload();
    }
  }
}
