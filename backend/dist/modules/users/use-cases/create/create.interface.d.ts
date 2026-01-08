import { IUser } from '../../model/user.interface';
export interface ICreateUserRequest {
    firstName: string;
    lastName: string;
    password: string;
    roleId?: number;
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
}
export interface ICreateUserResponse {
    user: IUser;
}
//# sourceMappingURL=create.interface.d.ts.map