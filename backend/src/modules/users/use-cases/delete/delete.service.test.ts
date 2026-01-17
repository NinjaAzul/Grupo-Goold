import { DeleteUserService } from './delete.service';
import { UserModel } from '@modules/users/model/user.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { ROLES } from '@/@shared/constants';
import { LoggerService } from '@shared/utils/logger.service';
import { IUser } from '@modules/users/model/user.interface';
import { DeleteUserRepository } from './delete.repository';

// Mock dos models
jest.mock('@modules/users/model/user.model');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserService;
  const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
  const mockAppointmentModel = AppointmentModel as jest.Mocked<
    typeof AppointmentModel
  >;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    deleteUserService = new DeleteUserService();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      mockUserModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(deleteUserService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteUserService.execute(999)).rejects.toThrow(
        'User not found'
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
        'Cannot delete the last admin user. At least one admin must exist.'
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

      // Mock do repository delete
      const mockDelete = jest.fn().mockResolvedValue(true);
      (
        deleteUserService as unknown as { repository: DeleteUserRepository }
      ).repository = {
        delete: mockDelete,
      } as DeleteUserRepository;

      await deleteUserService.execute(1);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserModel.count).toHaveBeenCalledWith({
        where: { roleId: ROLES.ADMIN },
      });
      expect(mockAppointmentModel.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(mockDelete).toHaveBeenCalledWith(1);
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
        'Cannot delete user. There are 5 appointment(s) associated with this user.'
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

      // Mock do repository delete
      const mockDelete = jest.fn().mockResolvedValue(true);
      (
        deleteUserService as unknown as { repository: DeleteUserRepository }
      ).repository = {
        delete: mockDelete,
      } as DeleteUserRepository;

      await deleteUserService.execute(3);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(3);
      expect(mockAppointmentModel.count).toHaveBeenCalledWith({
        where: { userId: 3 },
      });
      expect(mockDelete).toHaveBeenCalledWith(3);
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

      // Mock do repository delete retornando false
      const mockDelete = jest.fn().mockResolvedValue(false);
      (
        deleteUserService as unknown as { repository: DeleteUserRepository }
      ).repository = {
        delete: mockDelete,
      } as DeleteUserRepository;

      await expect(deleteUserService.execute(4)).rejects.toThrow(NotFoundError);
      await expect(deleteUserService.execute(4)).rejects.toThrow(
        'User not found'
      );
    });
  });
});
