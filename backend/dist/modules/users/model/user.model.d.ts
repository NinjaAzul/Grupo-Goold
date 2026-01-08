import { Model } from 'sequelize';
export declare class UserModel extends Model {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    roleId: number;
    zipCode?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    cityId?: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=user.model.d.ts.map