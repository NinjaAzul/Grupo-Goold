import { ListUsersService } from './list.service';
import { ListUsersRepository } from './list.repository';
import { IUser } from '@modules/users/model/user.interface';

// Mocks
jest.mock('./list.repository');

describe('ListUsersService', () => {
  let listUsersService: ListUsersService;
  let mockListUsersRepository: jest.Mocked<ListUsersRepository>;

  beforeEach(() => {
    mockListUsersRepository =
      new ListUsersRepository() as jest.Mocked<ListUsersRepository>;
    listUsersService = new ListUsersService();
    (
      listUsersService as unknown as { repository: ListUsersRepository }
    ).repository = mockListUsersRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockUsers: Partial<IUser>[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
    ];

    it('should return paginated users with default values', async () => {
      mockListUsersRepository.findAll = jest.fn().mockResolvedValue({
        users: mockUsers as IUser[],
        total: 2,
      });

      const result = await listUsersService.execute({});

      expect(mockListUsersRepository.findAll).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(10);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should return paginated users with custom filters', async () => {
      mockListUsersRepository.findAll = jest.fn().mockResolvedValue({
        users: [mockUsers[0]] as IUser[],
        total: 1,
      });

      const result = await listUsersService.execute({
        page: 1,
        limit: 5,
        name: 'John',
        email: 'john@example.com',
        roleId: 1,
        cityId: 1,
        active: true,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(mockListUsersRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        name: 'John',
        email: 'john@example.com',
        roleId: 1,
        cityId: 1,
        active: true,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(5);
      expect(result.pagination?.total).toBe(1);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
      mockListUsersRepository.findAll = jest.fn().mockResolvedValue({
        users: [],
        total: 0,
      });

      const result = await listUsersService.execute({});

      expect(result.data).toEqual([]);
      expect(result.pagination?.total).toBe(0);
      expect(result.pagination?.totalPages).toBe(0);
    });
  });
});
