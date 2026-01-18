import { UserRepository } from '../../repositories/user.repository';
import {
  ICheckEmailRequest,
  ICheckEmailResponse,
} from './check-email.interface';

export class CheckEmailService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute({ email }: ICheckEmailRequest): Promise<ICheckEmailResponse> {
    const exists = await this.userRepository.emailExists(email);

    return { exists };
  }
}
