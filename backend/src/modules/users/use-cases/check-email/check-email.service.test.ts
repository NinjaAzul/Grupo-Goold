import { CheckEmailService } from './check-email.service';
import { CheckEmailRepository } from './check-email.repository';

// Mocks
jest.mock('./check-email.repository');

describe('CheckEmailService', () => {
  let checkEmailService: CheckEmailService;
  let mockCheckEmailRepository: jest.Mocked<CheckEmailRepository>;

  beforeEach(() => {
    mockCheckEmailRepository =
      new CheckEmailRepository() as jest.Mocked<CheckEmailRepository>;
    checkEmailService = new CheckEmailService();
    (
      checkEmailService as unknown as {
        checkEmailRepository: CheckEmailRepository;
      }
    ).checkEmailRepository = mockCheckEmailRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return exists true when email is found', async () => {
      mockCheckEmailRepository.exists = jest.fn().mockResolvedValue(true);

      const result = await checkEmailService.execute({
        email: 'test@example.com',
      });

      expect(mockCheckEmailRepository.exists).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(result.exists).toBe(true);
    });

    it('should return exists false when email is not found', async () => {
      mockCheckEmailRepository.exists = jest.fn().mockResolvedValue(false);

      const result = await checkEmailService.execute({
        email: 'notfound@example.com',
      });

      expect(mockCheckEmailRepository.exists).toHaveBeenCalledWith(
        'notfound@example.com'
      );
      expect(result.exists).toBe(false);
    });
  });
});
