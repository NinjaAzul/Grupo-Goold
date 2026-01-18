"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_service_1 = require("./profile.service");
const user_repository_1 = require("../../repositories/user.repository");
const errors_1 = require("@shared/errors");
// Mocks
jest.mock('../../repositories/user.repository');
describe('GetProfileService', () => {
    let getProfileService;
    let mockUserRepository;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        getProfileService = new profile_service_1.GetProfileService();
        getProfileService.repository = mockUserRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
        };
        it('should return user profile', async () => {
            mockUserRepository.findById = jest
                .fn()
                .mockResolvedValue(mockUser);
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
            await expect(getProfileService.execute(999)).rejects.toThrow(errors_1.NotFoundError);
            await expect(getProfileService.execute(999)).rejects.toThrow('Usuário não encontrado');
            expect(mockUserRepository.findById).toHaveBeenCalledWith(999, {
                includeRole: true,
                includeCity: true,
                includePermissions: true,
                excludePassword: true,
            });
        });
    });
});
//# sourceMappingURL=profile.service.test.js.map