import { Model } from 'sequelize';
export declare class UserModel extends Model {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
    active: boolean;
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