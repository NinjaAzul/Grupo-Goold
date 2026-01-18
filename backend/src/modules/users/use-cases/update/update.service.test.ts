import { UpdateUserService } from './update.service';
import { UserRepository } from '../../repositories/user.repository';
import { CityRepository } from '@modules/cities/repositories/city.repository';
import { RoleRepository } from '@modules/roles/repositories/role.repository';
import { UserModel } from '@modules/users/model/user.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';
import bcrypt from 'bcrypt';
import { IUpdateUserRequest } from './update.interface';
import { IUser } from '@modules/users/model/user.interface';
import { ICity } from '@modules/cities/model/city.interface';
import { IRole } from '@modules/roles/model/role.interface';

// Mocks
jest.mock('bcrypt');
jest.mock('../../repositories/user.repository');
jest.mock('@modules/cities/repositories/city.repository');
jest.mock('@modules/roles/repositories/role.repository');
jest.mock('@modules/users/model/user.model');
jest.mock('@shared/utils/logger.service');

describe('UpdateUserService', () => {
  let updateUserService: UpdateUserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockCityRepository: jest.Mocked<CityRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockCityRepository = new CityRepository() as jest.Mocked<CityRepository>;
    mockRoleRepository = new RoleRepository() as jest.Mocked<RoleRepository>;
    updateUserService = new UpdateUserService();
    (
      updateUserService as unknown as {
        userRepository: UserRepository;
        cityRepository: CityRepository;
        roleRepository: RoleRepository;
      }
    ).userRepository = mockUserRepository;
    (
      updateUserService as unknown as {
        userRepository: UserRepository;
        cityRepository: CityRepository;
        roleRepository: RoleRepository;
      }
    ).cityRepository = mockCityRepository;
    (
      updateUserService as unknown as {
        userRepository: UserRepository;
        cityRepository: CityRepository;
        roleRepository: RoleRepository;
      }
    ).roleRepository = mockRoleRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const existingUser: Partial<IUser> = {
      id: 1,
      email: 'existing@test.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should throw NotFoundError when user does not exist', async () => {
      mockUserModel.findByPk = jest.fn().mockResolvedValue(null);

      const updateRequest: IUpdateUserRequest = {
        userId: 999,
        firstName: 'Updated',
      };

      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(999);
    });

    it('should throw BadRequestError when email is already in use by another user', async () => {
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        email: 'newemail@test.com',
      };

      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        BadRequestError
      );
      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        'Este e-mail já está em uso'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'newemail@test.com'
      );
    });

    it('should allow updating email to the same email', async () => {
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockUserRepository.update = jest.fn().mockResolvedValue({
        ...existingUser,
        firstName: 'Updated',
      } as IUser);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        email: 'existing@test.com',
        firstName: 'Updated',
      };

      await updateUserService.execute(updateRequest);

      expect(mockUserModel.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundError when city does not exist', async () => {
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockCityRepository.findById = jest.fn().mockResolvedValue(null);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        cityId: 999,
      };

      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        'Cidade não encontrada'
      );

      expect(mockCityRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should throw NotFoundError when role does not exist', async () => {
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockRoleRepository.findById = jest.fn().mockResolvedValue(null);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        roleId: 999,
      };

      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        'Perfil não encontrado'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should hash password when password is provided', async () => {
      const hashedPassword = 'hashedPassword123';
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.update = jest.fn().mockResolvedValue({
        ...existingUser,
      } as IUser);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        password: 'newPassword123',
      };

      await updateUserService.execute(updateRequest);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword,
        })
      );
    });

    it('should update user successfully without password', async () => {
      const updatedUser: Partial<IUser> = {
        ...existingUser,
        firstName: 'Updated',
      };
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockUserRepository.update = jest
        .fn()
        .mockResolvedValue(updatedUser as IUser);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        firstName: 'Updated',
      };

      const result = await updateUserService.execute(updateRequest);

      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(updateRequest);
      expect(result.user).toEqual(updatedUser);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Atualização de perfil',
        'Minha Conta',
        1,
        'Usuário existing@test.com atualizou perfil'
      );
    });

    it('should update user successfully with all validations passing', async () => {
      const mockCity: ICity = { id: 1, name: 'São Paulo', stateId: 1 };
      const mockRole: IRole = { id: 2, name: 'USER' };
      const hashedPassword = 'hashedPassword123';
      const updatedUser: Partial<IUser> = {
        ...existingUser,
        firstName: 'Updated',
        cityId: 1,
        roleId: 2,
      };

      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
      mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
      mockRoleRepository.findById = jest.fn().mockResolvedValue(mockRole);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.update = jest
        .fn()
        .mockResolvedValue(updatedUser as IUser);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        firstName: 'Updated',
        email: 'newemail@test.com',
        cityId: 1,
        roleId: 2,
        password: 'newPassword123',
      };

      const result = await updateUserService.execute(updateRequest);

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'newemail@test.com'
      );
      expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(2);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(result.user).toEqual(updatedUser);
    });

    it('should throw NotFoundError when repository update returns null', async () => {
      mockUserModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingUser as IUser);
      mockUserRepository.update = jest.fn().mockResolvedValue(null);

      const updateRequest: IUpdateUserRequest = {
        userId: 1,
        firstName: 'Updated',
      };

      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateUserService.execute(updateRequest)).rejects.toThrow(
        'Usuário não encontrado'
      );
    });
  });
});
