import { UserModel } from '../../model/user.model';
import { IUser } from '../../model/user.interface';

export class LoginRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user.toJSON() as IUser;
  }
}

