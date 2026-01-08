import { IUser } from '@modules/users/model/user.interface';

export interface IUpdateUserRequest {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  roleId?: number;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  cityId?: number;
}

export interface IUpdateUserResponse {
  user: IUser;
}
