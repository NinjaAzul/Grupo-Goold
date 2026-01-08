import { IUser } from '@modules/users/model/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}
