import { IRole } from '@modules/roles';
import { ICity } from '@modules/cities';
export interface IUser {
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
    role?: IRole;
    city?: ICity;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
//# sourceMappingURL=user.interface.d.ts.map