import { UpdateUserPermissionService } from './update-permission.service';
import { UpdateUserPermissionRepository } from './update-permission.repository';

// Mocks
jest.mock('./update-permission.repository');

describe('UpdateUserPermissionService', () => {
  let updateUserPermissionService: UpdateUserPermissionService;
  let mockUpdateUserPermissionRepository: jest.Mocked<UpdateUserPermissionRepository>;

  beforeEach(() => {
    mockUpdateUserPermissionRepository =
      new UpdateUserPermissionRepository() as jest.Mocked<UpdateUserPermissionRepository>;
    updateUserPermissionService = new UpdateUserPermissionService();
    (
      updateUserPermissionService as unknown as {
        repository: UpdateUserPermissionRepository;
      }
    ).repository = mockUpdateUserPermissionRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully grant permission', async () => {
      mockUpdateUserPermissionRepository.update = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await updateUserPermissionService.execute({
        userId: 1,
        permissionId: 2,
        granted: true,
      });

      expect(mockUpdateUserPermissionRepository.update).toHaveBeenCalledWith({
        userId: 1,
        permissionId: 2,
        granted: true,
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('User permission updated successfully');
    });

    it('should successfully revoke permission', async () => {
      mockUpdateUserPermissionRepository.update = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await updateUserPermissionService.execute({
        userId: 1,
        permissionId: 2,
        granted: false,
      });

      expect(mockUpdateUserPermissionRepository.update).toHaveBeenCalledWith({
        userId: 1,
        permissionId: 2,
        granted: false,
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('User permission updated successfully');
    });

    it('should propagate NotFoundError when user does not exist', async () => {
      const { NotFoundError } = await import('@shared/errors');
      mockUpdateUserPermissionRepository.update = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await expect(
        updateUserPermissionService.execute({
          userId: 999,
          permissionId: 2,
          granted: true,
        })
      ).rejects.toThrow('User not found');
    });

    it('should propagate NotFoundError when permission does not exist', async () => {
      const { NotFoundError } = await import('@shared/errors');
      mockUpdateUserPermissionRepository.update = jest
        .fn()
        .mockRejectedValue(new NotFoundError('Permission not found'));

      await expect(
        updateUserPermissionService.execute({
          userId: 1,
          permissionId: 999,
          granted: true,
        })
      ).rejects.toThrow('Permission not found');
    });
  });
});
