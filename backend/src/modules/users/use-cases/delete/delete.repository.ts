import { UserModel } from '@modules/users/model/user.model';

export class DeleteUserRepository {
  async delete(userId: number): Promise<boolean> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }
}
