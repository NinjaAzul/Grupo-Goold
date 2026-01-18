import { GetProfileService } from './profile.service';
import { UserRepository } from '../../repositories/user.repository';
import { NotFoundError } from '@shared/errors';
import { IUser } from '@modules/users/model/user.interface';

// Mocks
jest.mock('../../repositories/user.repository');

describe('GetProfileService', () => {
  let getProfileService: GetProfileService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    getProfileService = new GetProfileService();
    (
      getProfileService as unknown as { repository: UserRepository }
    ).repository = mockUserRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockUser: Partial<IUser> = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    it('should return user profile', async () => {
      mockUserRepository.findById = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      const result = await getProfileService.execute(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1, {
        includeRole: true,
        includeCity: true,
        includePermissions: true,
        excludePassword: true,
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockUserRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(getProfileService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(getProfileService.execute(999)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(999, {
        includeRole: true,
        includeCity: true,
        includePermissions: true,
        excludePassword: true,
      });
    });
  });
});
