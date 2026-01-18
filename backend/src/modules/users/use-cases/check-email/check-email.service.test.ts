import { CheckEmailService } from './check-email.service';
import { UserRepository } from '../../repositories/user.repository';

// Mocks
jest.mock('../../repositories/user.repository');

describe('CheckEmailService', () => {
  let checkEmailService: CheckEmailService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    checkEmailService = new CheckEmailService();
    (
      checkEmailService as unknown as {
        userRepository: UserRepository;
      }
    ).userRepository = mockUserRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return exists true when email is found', async () => {
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);

      const result = await checkEmailService.execute({
        email: 'test@example.com',
      });

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(result.exists).toBe(true);
    });

    it('should return exists false when email is not found', async () => {
      mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);

      const result = await checkEmailService.execute({
        email: 'notfound@example.com',
      });

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(
        'notfound@example.com'
      );
      expect(result.exists).toBe(false);
    });
  });
});
