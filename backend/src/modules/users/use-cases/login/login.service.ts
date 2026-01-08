import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { LoginRepository } from './login.repository';
import { ILoginRequest, ILoginResponse } from './login.interface';
import { UnauthorizedError } from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';

export class LoginService {
  private loginRepository: LoginRepository;

  constructor() {
    this.loginRepository = new LoginRepository();
  }

  async execute({ email, password }: ILoginRequest): Promise<ILoginResponse> {
    const user = await this.loginRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Email or password incorrect');
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

    // Registrar log de login
    await LoggerService.log(
      'Login',
      'Minha Conta',
      user.id,
      `Usuário ${user.email} realizou login`
    );

    return tokenReturn;
  }
}
