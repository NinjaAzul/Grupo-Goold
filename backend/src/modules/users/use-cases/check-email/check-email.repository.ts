import { UserModel } from '../../model/user.model';

export class CheckEmailRepository {
  async exists(email: string): Promise<boolean> {
    const user = await UserModel.findOne({
      where: { email },
      attributes: ['id'],
    });

    return !!user;
  }
}
