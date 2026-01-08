import { IUser } from '@modules/users/model/user.interface';

export interface ILog {
  id: number;
  userId?: number | null;
  activityType: string;
  module: string;
  description?: string | null;
  user?: IUser;
  readonly createdAt?: Date;
}
