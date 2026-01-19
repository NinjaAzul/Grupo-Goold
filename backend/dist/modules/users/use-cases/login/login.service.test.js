"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_service_1 = require("./login.service");
const user_repository_1 = require("../../repositories/user.repository");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mocks
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../repositories/user.repository');
jest.mock('@shared/utils/logger.service');
describe('LoginService', () => {
    let loginService;
    let mockUserRepository;
    const mockBcrypt = bcrypt_1.default;
    const mockJwt = jsonwebtoken_1.default;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        loginService = new login_service_1.LoginService();
        loginService.userRepository = mockUserRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockUser = {
            id: 1,
            email: 'user@test.com',
            password: 'hashedPassword123',
            firstName: 'John',
            lastName: 'Doe',
            roleId: 2,
            active: true,
        };
        it('should throw UnauthorizedError when user does not exist', async () => {
            mockUserRepository.findByEmail = jest.fn().mockResolvedValue(null);
            await expect(loginService.execute({
                email: 'nonexistent@test.com',
                password: 'password123',
            })).rejects.toThrow(errors_1.UnauthorizedError);
            await expect(loginService.execute({
                email: 'nonexistent@test.com',
                password: 'password123',
            })).rejects.toThrow('E-mail ou senha incorretos');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@test.com', {
                includePermissions: true,
                excludePassword: false,
            });
            expect(mockBcrypt.compare).not.toHaveBeenCalled();
        });
        it('should throw UnauthorizedError when user is inactive', async () => {
            const inactiveUser = {
                ...mockUser,
                active: false,
            };
            mockUserRepository.findByEmail = jest
                .fn()
                .mockResolvedValue(inactiveUser);
            await expect(loginService.execute({
                email: 'user@test.com',
                password: 'password123',
            })).rejects.toThrow(errors_1.UnauthorizedError);
            await expect(loginService.execute({
                email: 'user@test.com',
                password: 'password123',
            })).rejects.toThrow('Sua conta está desativada. Entre em contato com o administrador.');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@test.com', {
                includePermissions: true,
                excludePassword: false,
            });
            expect(mockBcrypt.compare).not.toHaveBeenCalled();
        });
        it('should throw UnauthorizedError when password is incorrect', async () => {
            mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
            mockBcrypt.compare = jest.fn().mockResolvedValue(false);
            await expect(loginService.execute({
                email: 'user@test.com',
                password: 'wrongPassword',
            })).rejects.toThrow(errors_1.UnauthorizedError);
            await expect(loginService.execute({
                email: 'user@test.com',
                password: 'wrongPassword',
            })).rejects.toThrow('E-mail ou senha incorretos');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@test.com', {
                includePermissions: true,
                excludePassword: false,
            });
            expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword123');
        });
        it('should successfully login and return token with user without password', async () => {
            const mockToken = 'mock-jwt-token';
            const userWithoutPassword = {
                id: 1,
                email: 'user@test.com',
                firstName: 'John',
                lastName: 'Doe',
                active: true,
                roleId: 2,
            };
            mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
            mockBcrypt.compare = jest.fn().mockResolvedValue(true);
            mockJwt.sign = jest.fn().mockReturnValue(mockToken);
            const result = await loginService.execute({
                email: 'user@test.com',
                password: 'correctPassword',
            });
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@test.com', {
                includePermissions: true,
                excludePassword: false,
            });
            expect(mockBcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword123');
            expect(mockJwt.sign).toHaveBeenCalledWith({}, process.env.JWT_SECRET, {
                subject: '1',
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            expect(result.token).toBe(mockToken);
            expect(result.user).toEqual(userWithoutPassword);
            expect(result.user).not.toHaveProperty('password');
            expect(mockLoggerService.log).toHaveBeenCalledWith('Login', 'Minha Conta', 1, 'Usuário user@test.com realizou login');
        });
        it('should use correct JWT secret and expiration from environment', async () => {
            const originalSecret = process.env.JWT_SECRET;
            const originalExpires = process.env.JWT_EXPIRES_IN;
            process.env.JWT_SECRET = 'custom-secret';
            process.env.JWT_EXPIRES_IN = '2h';
            mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
            mockBcrypt.compare = jest.fn().mockResolvedValue(true);
            mockJwt.sign = jest.fn().mockReturnValue('token');
            await loginService.execute({
                email: 'user@test.com',
                password: 'correctPassword',
            });
            expect(mockJwt.sign).toHaveBeenCalledWith({}, 'custom-secret', {
                subject: '1',
                expiresIn: '2h',
            });
            process.env.JWT_SECRET = originalSecret;
            process.env.JWT_EXPIRES_IN = originalExpires;
        });
    });
});
//# sourceMappingURL=login.service.test.js.map