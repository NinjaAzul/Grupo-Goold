import { Model } from 'sequelize';
import { IPermission } from './permission.interface';
export declare class PermissionModel extends Model<IPermission> implements IPermission {
    id: number;
    name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=permission.model.d.ts.map