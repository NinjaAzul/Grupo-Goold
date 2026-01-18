import { LoginService } from './login.service';
import { UserRepository } from '../../repositories/user.repository';
import { UnauthorizedError } from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@modules/users/model/user.interface';

// Mocks
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../repositories/user.repository');
jest.mock('@shared/utils/logger.service');

describe('LoginService', () => {
  let loginService: LoginService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  const mockJwt = jwt as jest.Mocked<typeof jwt>;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    loginService = new LoginService();
    (
      loginService as unknown as { userRepository: UserRepository }
    ).userRepository = mockUserRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockUser: IUser = {
      id: 1,
      email: 'user@test.com',
      password: 'hashedPassword123',
      firstName: 'John',
      lastName: 'Doe',
      roleId: 2,
      active: true,
    };

    it('should throw UnauthorizedError when user does not exist', async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        loginService.execute({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        loginService.execute({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow('E-mail ou senha incorretos');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@test.com',
        {
          includePermissions: true,
          excludePassword: false,
        }
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when password is incorrect', async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(
        loginService.execute({
          email: 'user@test.com',
          password: 'wrongPassword',
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        loginService.execute({
          email: 'user@test.com',
          password: 'wrongPassword',
        })
      ).rejects.toThrow('E-mail ou senha incorretos');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'user@test.com',
        {
          includePermissions: true,
          excludePassword: false,
        }
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword123'
      );
    });

    it('should successfully login and return token with user without password', async () => {
      const mockToken = 'mock-jwt-token';
      const userWithoutPassword = {
        id: 1,
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        active: true,
        roleId: 2,
      };

      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockJwt.sign = jest.fn().mockReturnValue(mockToken);

      const result = await loginService.execute({
        email: 'user@test.com',
        password: 'correctPassword',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'user@test.com',
        {
          includePermissions: true,
          excludePassword: false,
        }
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'correctPassword',
        'hashedPassword123'
      );
      expect(mockJwt.sign).toHaveBeenCalledWith({}, process.env.JWT_SECRET, {
        subject: '1',
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      expect(result.token).toBe(mockToken);
      expect(result.user).toEqual(userWithoutPassword);
      expect(result.user).not.toHaveProperty('password');
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Login',
        'Minha Conta',
        1,
        'Usuário user@test.com realizou login'
      );
    });

    it('should use correct JWT secret and expiration from environment', async () => {
      const originalSecret = process.env.JWT_SECRET;
      const originalExpires = process.env.JWT_EXPIRES_IN;

      process.env.JWT_SECRET = 'custom-secret';
      process.env.JWT_EXPIRES_IN = '2h';

      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockJwt.sign = jest.fn().mockReturnValue('token');

      await loginService.execute({
        email: 'user@test.com',
        password: 'correctPassword',
      });

      expect(mockJwt.sign).toHaveBeenCalledWith({}, 'custom-secret', {
        subject: '1',
        expiresIn: '2h',
      });

      process.env.JWT_SECRET = originalSecret;
      process.env.JWT_EXPIRES_IN = originalExpires;
    });
  });
});
