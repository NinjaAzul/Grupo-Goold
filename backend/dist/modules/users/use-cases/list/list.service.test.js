"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_service_1 = require("./list.service");
const user_repository_1 = require("../../repositories/user.repository");
// Mocks
jest.mock('../../repositories/user.repository');
describe('ListUsersService', () => {
    let listUsersService;
    let mockUserRepository;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        listUsersService = new list_service_1.ListUsersService();
        listUsersService.repository =
            mockUserRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockUsers = [
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
            mockUserRepository.findAll = jest.fn().mockResolvedValue({
                users: mockUsers,
                total: 2,
            });
            const result = await listUsersService.execute({});
            expect(mockUserRepository.findAll).toHaveBeenCalledWith({});
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockUsers);
            expect(result.pagination?.page).toBe(1);
            expect(result.pagination?.limit).toBe(10);
            expect(result.pagination?.total).toBe(2);
            expect(result.pagination?.totalPages).toBe(1);
        });
        it('should return paginated users with custom filters', async () => {
            mockUserRepository.findAll = jest.fn().mockResolvedValue({
                users: [mockUsers[0]],
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
            expect(mockUserRepository.findAll).toHaveBeenCalledWith({
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
            mockUserRepository.findAll = jest.fn().mockResolvedValue({
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
//# sourceMappingURL=list.service.test.js.map