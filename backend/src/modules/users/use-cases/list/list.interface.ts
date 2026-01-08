import { IUser } from '@modules/users/model/user.interface';
import { PaginatedResponse } from '@shared/types';

export interface IListUsersRequest {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  roleId?: number;
  cityId?: number;
}

export interface IListUsersResponse extends PaginatedResponse<IUser> {}
