import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../../repositories/user.repository';
import { ILoginRequest, ILoginResponse } from './login.interface';
import { UnauthorizedError } from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';

export class LoginService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute({ email, password }: ILoginRequest): Promise<ILoginResponse> {
    const user = await this.userRepository.findByEmail(email, {
      includePermissions: true,
      excludePassword: false,
    });

    if (!user) {
      throw new UnauthorizedError('E-mail ou senha incorretos');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('E-mail ou senha incorretos');
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = sign({}, process.env.JWT_SECRET, {
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const tokenReturn: ILoginResponse = {
      user: userWithoutPassword,
      token,
    };

    await LoggerService.log(
      'Login',
      'Minha Conta',
      user.id,
      `Usuário ${user.email} realizou login`
    );

    return tokenReturn;
  }
}
