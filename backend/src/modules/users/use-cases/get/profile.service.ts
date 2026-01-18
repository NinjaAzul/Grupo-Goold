import { UserRepository } from '../../repositories/user.repository';
import { IGetProfileResponse } from './profile.interface';
import { NotFoundError } from '@shared/errors';

export class GetProfileService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute(userId: number): Promise<IGetProfileResponse> {
    const user = await this.repository.findById(userId, {
      includeRole: true,
      includeCity: true,
      includePermissions: true,
      excludePassword: true,
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return { user };
  }
}
