"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_email_service_1 = require("./check-email.service");
const user_repository_1 = require("../../repositories/user.repository");
// Mocks
jest.mock('../../repositories/user.repository');
describe('CheckEmailService', () => {
    let checkEmailService;
    let mockUserRepository;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        checkEmailService = new check_email_service_1.CheckEmailService();
        checkEmailService.userRepository = mockUserRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        it('should return exists true when email is found', async () => {
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);
            const result = await checkEmailService.execute({
                email: 'test@example.com',
            });
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('test@example.com');
            expect(result.exists).toBe(true);
        });
        it('should return exists false when email is not found', async () => {
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            const result = await checkEmailService.execute({
                email: 'notfound@example.com',
            });
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('notfound@example.com');
            expect(result.exists).toBe(false);
        });
    });
});
//# sourceMappingURL=check-email.service.test.js.map