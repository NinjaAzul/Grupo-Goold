import { DeleteUserService } from './delete.service';
import { UserRepository } from '../../repositories/user.repository';
import { UserModel } from '@modules/users/model/user.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { ROLES } from '@/@shared/constants';
import { LoggerService } from '@shared/utils/logger.service';
import { IUser } from '@modules/users/model/user.interface';

// Mocks
jest.mock('../../repositories/user.repository');

jest.mock('@modules/users/model/user.model');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
  const mockAppointmentModel = AppointmentModel as jest.Mocked<
    typeof AppointmentModel
  >;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    deleteUserService = new DeleteUserService();
    (
      deleteUserService as unknown as { userRepository: UserRepository }
    ).userRepository = mockUserRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      mockUserModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(deleteUserService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteUserService.execute(999)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(999);
    });

    it('should throw BadRequestError when trying to delete the last admin', async () => {
      const adminUser: Partial<IUser> = {
        id: 1,
        email: 'admin@test.com',
        roleId: ROLES.ADMIN,
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(adminUser as IUser);
      mockUserModel.count = jest.fn().mockResolvedValue(1);

      await expect(deleteUserService.execute(1)).rejects.toThrow(
        BadRequestError
      );
      await expect(deleteUserService.execute(1)).rejects.toThrow(
        'Não é possível excluir o último usuário administrador. Deve existir pelo menos um administrador.'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserModel.count).toHaveBeenCalledWith({
        where: { roleId: ROLES.ADMIN },
      });
    });

    it('should allow deleting admin when there are multiple admins', async () => {
      const adminUser: Partial<IUser> = {
        id: 1,
        email: 'admin@test.com',
        roleId: ROLES.ADMIN,
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(adminUser as IUser);
      mockUserModel.count = jest.fn().mockResolvedValue(2);
      mockAppointmentModel.count = jest.fn().mockResolvedValue(0);

      mockUserRepository.delete = jest.fn().mockResolvedValue(true);

      await deleteUserService.execute(1);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserModel.count).toHaveBeenCalledWith({
        where: { roleId: ROLES.ADMIN },
      });
      expect(mockAppointmentModel.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestError when user has appointments', async () => {
      const user: Partial<IUser> = {
        id: 2,
        email: 'user@test.com',
        roleId: ROLES.USER,
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(user);
      mockAppointmentModel.count = jest.fn().mockResolvedValue(5);

      await expect(deleteUserService.execute(2)).rejects.toThrow(
        BadRequestError
      );
      await expect(deleteUserService.execute(2)).rejects.toThrow(
        'Não é possível excluir o usuário. Existem 5 agendamento(s) associados a este usuário.'
      );

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(2);
      expect(mockAppointmentModel.count).toHaveBeenCalledWith({
        where: { userId: 2 },
      });
    });

    it('should successfully delete user without appointments', async () => {
      const user: Partial<IUser> = {
        id: 3,
        email: 'user@test.com',
        roleId: ROLES.USER,
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(user as IUser);
      mockAppointmentModel.count = jest.fn().mockResolvedValue(0);

      mockUserRepository.delete = jest.fn().mockResolvedValue(true);

      await deleteUserService.execute(3);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(3);
      expect(mockAppointmentModel.count).toHaveBeenCalledWith({
        where: { userId: 3 },
      });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(3);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Exclusão de usuário',
        'Minha Conta',
        3,
        'Usuário user@test.com foi excluído'
      );
    });

    it('should throw NotFoundError when repository delete returns false', async () => {
      const user: Partial<IUser> = {
        id: 4,
        email: 'user@test.com',
        roleId: ROLES.USER,
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(user as IUser);
      mockAppointmentModel.count = jest.fn().mockResolvedValue(0);

      mockUserRepository.delete = jest.fn().mockResolvedValue(false);

      await expect(deleteUserService.execute(4)).rejects.toThrow(NotFoundError);
      await expect(deleteUserService.execute(4)).rejects.toThrow(
        'Usuário não encontrado'
      );
    });
  });
});
