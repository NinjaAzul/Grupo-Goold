import { UserPermissionModel } from '../model/user-permission.model';
import { PermissionModel } from '@modules/permissions';
import { UserModel } from '@modules/users/model/user.model';
import { IUpdateUserPermissionRequest } from '@modules/users/use-cases/update-permission/update-permission.interface';

export class UserPermissionRepository {
  async findUserById(userId: number): Promise<{ id: number } | null> {
    const user = await UserModel.findByPk(userId);
    return user ? { id: user.id } : null;
  }

  async findPermissionById(
    permissionId: number
  ): Promise<{ id: number } | null> {
    const permission = await PermissionModel.findByPk(permissionId);
    return permission ? { id: permission.id } : null;
  }

  async update(data: IUpdateUserPermissionRequest): Promise<void> {
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
