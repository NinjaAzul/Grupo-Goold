import { CreateUserService } from './create.service';
import { UserRepository } from '../../repositories/user.repository';
import { CityRepository } from '@modules/cities/repositories/city.repository';
import { NotFoundError, ConflictError } from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './create.dto';
import { IUser } from '@modules/users/model/user.interface';
import { ICity } from '@modules/cities/model/city.interface';

// Mocks
jest.mock('bcrypt');
jest.mock('../../repositories/user.repository');
jest.mock('@modules/cities/repositories/city.repository');
jest.mock('@shared/utils/logger.service');

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockCityRepository: jest.Mocked<CityRepository>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockCityRepository = new CityRepository() as jest.Mocked<CityRepository>;
    createUserService = new CreateUserService();
    (
      createUserService as unknown as {
        userRepository: UserRepository;
        cityRepository: CityRepository;
      }
    ).userRepository = mockUserRepository;
    (
      createUserService as unknown as {
        userRepository: UserRepository;
        cityRepository: CityRepository;
      }
    ).cityRepository = mockCityRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123',
      cityId: 1,
    };

    const mockCreatedUser: Partial<IUser> = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      permissions: [],
    };

    it('should throw ConflictError when email already exists', async () => {
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);

      await expect(createUserService.execute(validUserDto)).rejects.toThrow(
        ConflictError
      );
      await expect(createUserService.execute(validUserDto)).rejects.toThrow(
        'Este e-mail já está cadastrado'
      );

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'john.doe@test.com'
      );
      expect(mockCityRepository.findById).not.toHaveBeenCalled();
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when city does not exist', async () => {
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(createUserService.execute(validUserDto)).rejects.toThrow(
        NotFoundError
      );
      await expect(createUserService.execute(validUserDto)).rejects.toThrow(
        'Cidade não encontrada'
      );

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'john.doe@test.com'
      );
      expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should hash password before creating user', async () => {
      const mockCity: ICity = { id: 1, name: 'São Paulo', stateId: 1 };
      const hashedPassword = 'hashedPassword123';

      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.create = jest
        .fn()
        .mockResolvedValue(mockCreatedUser as IUser);

      await createUserService.execute(validUserDto);

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'john.doe@test.com'
      );
      expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...validUserDto,
        password: hashedPassword,
      });
    });

    it('should create user successfully with city validation', async () => {
      const mockCity: ICity = { id: 1, name: 'São Paulo', stateId: 1 };
      const hashedPassword = 'hashedPassword123';

      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.create = jest
        .fn()
        .mockResolvedValue(mockCreatedUser as IUser);

      const result = await createUserService.execute(validUserDto);

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'john.doe@test.com'
      );
      expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...validUserDto,
        password: hashedPassword,
      });
      expect(result.user).toEqual(mockCreatedUser);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Criação de usuário',
        'Minha Conta',
        1,
        'Usuário john.doe@test.com foi criado'
      );
    });

    it('should create user successfully without cityId', async () => {
      const userDtoWithoutCity: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'password456',
      };
      const hashedPassword = 'hashedPassword456';

      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.create = jest.fn().mockResolvedValue({
        ...mockCreatedUser,
        email: 'jane.smith@test.com',
      } as IUser);

      const result = await createUserService.execute(userDtoWithoutCity);

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'jane.smith@test.com'
      );
      expect(mockCityRepository.findById).not.toHaveBeenCalled();
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password456', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userDtoWithoutCity,
        password: hashedPassword,
      });
      expect(result.user).toBeDefined();
    });

    it('should throw error when repository create returns null', async () => {
      const mockCity: ICity = { id: 1, name: 'São Paulo', stateId: 1 };
      const hashedPassword = 'hashedPassword123';

      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.create = jest.fn().mockResolvedValue(null);

      await expect(createUserService.execute(validUserDto)).rejects.toThrow(
        'Falha ao criar usuário'
      );
    });

    it('should format user permissions correctly', async () => {
      const mockCity: ICity = { id: 1, name: 'São Paulo', stateId: 1 };
      const hashedPassword = 'hashedPassword123';
      const userWithPermissions: Partial<IUser> = {
        id: 1,
        email: 'john.doe@test.com',
        permissions: [
          {
            permission: { id: 1, name: 'LOGS' },
            granted: true,
          },
          {
            permission: { id: 2, name: 'APPOINTMENTS' },
            granted: false,
          },
        ],
      };

      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.create = jest
        .fn()
        .mockResolvedValue(userWithPermissions as IUser);

      const result = await createUserService.execute(validUserDto);

      expect(result.user).toBeDefined();
      if (result.user.permissions) {
        expect(Array.isArray(result.user.permissions)).toBe(true);
      }
    });
  });
});
