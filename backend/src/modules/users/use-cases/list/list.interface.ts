import { IUser } from '@modules/users/model/user.interface';
import { PaginatedResponse } from '@shared/types';

export interface IListUsersRequest {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  roleId?: number;
  cityId?: number;
  active?: boolean;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD)
}

export interface IListUsersResponse extends PaginatedResponse<IUser> {}
