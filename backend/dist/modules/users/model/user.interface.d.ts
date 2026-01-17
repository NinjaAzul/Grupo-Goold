import { IRole } from '@modules/roles';
import { ICity } from '@modules/cities';
import { IPermission } from '@modules/permissions/model/permission.interface';
export interface IUserPermission {
    permission: IPermission;
    granted: boolean;
}
export interface IUser {
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
    role?: IRole;
    city?: ICity;
    permissions?: IUserPermission[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
//# sourceMappingURL=user.interface.d.ts.map