import { IUser } from '@modules/users/model/user.interface';
import { IPermission } from '@modules/permissions/model/permission.interface';

export interface IUserPermission {
  id: number;
  userId: number;
  permissionId: number;
  granted: boolean;
  user?: IUser;
  permission?: IPermission;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
