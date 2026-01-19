import { UpdateUserPermissionService } from './update-permission.service';
import { UserPermissionRepository } from '@modules/user-permissions/repositories/user-permission.repository';

// Mocks
jest.mock('@modules/user-permissions/repositories/user-permission.repository');

describe('UpdateUserPermissionService', () => {
  let updateUserPermissionService: UpdateUserPermissionService;
  let mockUserPermissionRepository: jest.Mocked<UserPermissionRepository>;

  beforeEach(() => {
    mockUserPermissionRepository =
      new UserPermissionRepository() as jest.Mocked<UserPermissionRepository>;
    updateUserPermissionService = new UpdateUserPermissionService();
    (
      updateUserPermissionService as unknown as {
        userPermissionRepository: UserPermissionRepository;
      }
    ).userPermissionRepository = mockUserPermissionRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully grant permission', async () => {
      mockUserPermissionRepository.findUserById = jest
        .fn()
        .mockResolvedValue({ id: 1 });
      mockUserPermissionRepository.findPermissionById = jest
        .fn()
        .mockResolvedValue({ id: 2 });
      mockUserPermissionRepository.update = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await updateUserPermissionService.execute({
        userId: 1,
        permissionId: 2,
        granted: true,
      });

      expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
      expect(
        mockUserPermissionRepository.findPermissionById
      ).toHaveBeenCalledWith(2);
      expect(mockUserPermissionRepository.update).toHaveBeenCalledWith({
        userId: 1,
        permissionId: 2,
        granted: true,
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('User permission updated successfully');
    });

    it('should successfully revoke permission', async () => {
      mockUserPermissionRepository.findUserById = jest
        .fn()
        .mockResolvedValue({ id: 1 });
      mockUserPermissionRepository.findPermissionById = jest
        .fn()
        .mockResolvedValue({ id: 2 });
      mockUserPermissionRepository.update = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await updateUserPermissionService.execute({
        userId: 1,
        permissionId: 2,
        granted: false,
      });

      expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
      expect(
        mockUserPermissionRepository.findPermissionById
      ).toHaveBeenCalledWith(2);
      expect(mockUserPermissionRepository.update).toHaveBeenCalledWith({
        userId: 1,
        permissionId: 2,
        granted: false,
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('User permission updated successfully');
    });

    it('should propagate NotFoundError when user does not exist', async () => {
      const { NotFoundError } = await import('../../../../@shared/errors');
      mockUserPermissionRepository.findUserById = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        updateUserPermissionService.execute({
          userId: 999,
          permissionId: 2,
          granted: true,
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        updateUserPermissionService.execute({
          userId: 999,
          permissionId: 2,
          granted: true,
        })
      ).rejects.toThrow('Usuário não encontrado');

      expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(
        999
      );
      expect(
        mockUserPermissionRepository.findPermissionById
      ).not.toHaveBeenCalled();
      expect(mockUserPermissionRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate NotFoundError when permission does not exist', async () => {
      const { NotFoundError } = await import('../../../../@shared/errors');
      mockUserPermissionRepository.findUserById = jest
        .fn()
        .mockResolvedValue({ id: 1 });
      mockUserPermissionRepository.findPermissionById = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        updateUserPermissionService.execute({
          userId: 1,
          permissionId: 999,
          granted: true,
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        updateUserPermissionService.execute({
          userId: 1,
          permissionId: 999,
          granted: true,
        })
      ).rejects.toThrow('Permissão não encontrada');

      expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
      expect(
        mockUserPermissionRepository.findPermissionById
      ).toHaveBeenCalledWith(999);
      expect(mockUserPermissionRepository.update).not.toHaveBeenCalled();
    });
  });
});
