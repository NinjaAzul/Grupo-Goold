import { CheckEmailRepository } from './check-email.repository';
import {
  ICheckEmailRequest,
  ICheckEmailResponse,
} from './check-email.interface';

export class CheckEmailService {
  private checkEmailRepository: CheckEmailRepository;

  constructor() {
    this.checkEmailRepository = new CheckEmailRepository();
  }

  async execute({ email }: ICheckEmailRequest): Promise<ICheckEmailResponse> {
    const exists = await this.checkEmailRepository.exists(email);

    return { exists };
  }
}
