import { GetProfileService } from './profile.service';
import { GetProfileRepository } from './profile.repository';
import { NotFoundError } from '@shared/errors';
import { IUser } from '@modules/users/model/user.interface';

// Mocks
jest.mock('./profile.repository');

describe('GetProfileService', () => {
  let getProfileService: GetProfileService;
  let mockGetProfileRepository: jest.Mocked<GetProfileRepository>;

  beforeEach(() => {
    mockGetProfileRepository =
      new GetProfileRepository() as jest.Mocked<GetProfileRepository>;
    getProfileService = new GetProfileService();
    (
      getProfileService as unknown as { repository: GetProfileRepository }
    ).repository = mockGetProfileRepository;
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
      mockGetProfileRepository.findById = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      const result = await getProfileService.execute(1);

      expect(mockGetProfileRepository.findById).toHaveBeenCalledWith(1);
      expect(result.user).toEqual(mockUser);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockGetProfileRepository.findById = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await expect(getProfileService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(getProfileService.execute(999)).rejects.toThrow(
        'User not found'
      );

      expect(mockGetProfileRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});
