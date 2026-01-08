import { IUser } from '../../model/user.interface';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}
