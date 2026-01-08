import { GetProfileRepository } from './profile.repository';
import { IGetProfileResponse } from './profile.interface';

export class GetProfileService {
  private repository: GetProfileRepository;

  constructor() {
    this.repository = new GetProfileRepository();
  }

  async execute(userId: number): Promise<IGetProfileResponse> {
    const user = await this.repository.findById(userId);

    return { user };
  }
}
