import { UserPermissionModel } from '@modules/user-permissions';
import { PermissionModel } from '@modules/permissions';
import { UserModel } from '@modules/users/model/user.model';
import { NotFoundError } from '@shared/errors';
import { IUpdateUserPermissionRequest } from './update-permission.interface';

export class UpdateUserPermissionRepository {
  async update(data: IUpdateUserPermissionRequest): Promise<void> {
    const user = await UserModel.findByPk(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const permission = await PermissionModel.findByPk(data.permissionId);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    const userPermission = await UserPermissionModel.findOne({
      where: {
        userId: data.userId,
        permissionId: data.permissionId,
      },
    });

    if (!userPermission) {
      await UserPermissionModel.create({
        userId: data.userId,
        permissionId: data.permissionId,
        granted: data.granted,
      });
    } else {
      await userPermission.update({ granted: data.granted });
      await userPermission.reload();
    }
  }
}
