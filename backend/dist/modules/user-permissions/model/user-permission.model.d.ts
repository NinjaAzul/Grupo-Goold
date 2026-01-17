import { Model } from 'sequelize';
import { IUserPermission } from './user-permission.interface';
export declare class UserPermissionModel extends Model<IUserPermission> implements IUserPermission {
    id?: number;
    userId: number;
    permissionId: number;
    granted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=user-permission.model.d.ts.map