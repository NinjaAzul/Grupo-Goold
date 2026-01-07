import { IUser } from '../../model/user.interface';

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  password: string;
  roleId?: number; // Opcional, default será USER (2)
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
