"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_service_1 = require("./create.service");
const user_repository_1 = require("../../repositories/user.repository");
const city_repository_1 = require("@modules/cities/repositories/city.repository");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Mocks
jest.mock('bcrypt');
jest.mock('../../repositories/user.repository');
jest.mock('@modules/cities/repositories/city.repository');
jest.mock('@shared/utils/logger.service');
describe('CreateUserService', () => {
    let createUserService;
    let mockUserRepository;
    let mockCityRepository;
    const mockBcrypt = bcrypt_1.default;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        mockCityRepository = new city_repository_1.CityRepository();
        createUserService = new create_service_1.CreateUserService();
        createUserService.userRepository = mockUserRepository;
        createUserService.cityRepository = mockCityRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const validUserDto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            password: 'password123',
            cityId: 1,
        };
        const mockCreatedUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            permissions: [],
        };
        it('should throw ConflictError when email already exists', async () => {
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);
            await expect(createUserService.execute(validUserDto)).rejects.toThrow(errors_1.ConflictError);
            await expect(createUserService.execute(validUserDto)).rejects.toThrow('Este e-mail já está cadastrado');
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('john.doe@test.com');
            expect(mockCityRepository.findById).not.toHaveBeenCalled();
            expect(mockBcrypt.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
        it('should throw NotFoundError when city does not exist', async () => {
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(null);
            await expect(createUserService.execute(validUserDto)).rejects.toThrow(errors_1.NotFoundError);
            await expect(createUserService.execute(validUserDto)).rejects.toThrow('Cidade não encontrada');
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('john.doe@test.com');
            expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
            expect(mockBcrypt.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
        it('should hash password before creating user', async () => {
            const mockCity = { id: 1, name: 'São Paulo', stateId: 1 };
            const hashedPassword = 'hashedPassword123';
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.create = jest
                .fn()
                .mockResolvedValue(mockCreatedUser);
            await createUserService.execute(validUserDto);
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('john.doe@test.com');
            expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
            expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...validUserDto,
                password: hashedPassword,
            });
        });
        it('should create user successfully with city validation', async () => {
            const mockCity = { id: 1, name: 'São Paulo', stateId: 1 };
            const hashedPassword = 'hashedPassword123';
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.create = jest
                .fn()
                .mockResolvedValue(mockCreatedUser);
            const result = await createUserService.execute(validUserDto);
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('john.doe@test.com');
            expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
            expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...validUserDto,
                password: hashedPassword,
            });
            expect(result.user).toEqual(mockCreatedUser);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Criação de usuário', 'Minha Conta', 1, 'Usuário john.doe@test.com foi criado');
        });
        it('should create user successfully without cityId', async () => {
            const userDtoWithoutCity = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@test.com',
                password: 'password456',
            };
            const hashedPassword = 'hashedPassword456';
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.create = jest.fn().mockResolvedValue({
                ...mockCreatedUser,
                email: 'jane.smith@test.com',
            });
            const result = await createUserService.execute(userDtoWithoutCity);
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('jane.smith@test.com');
            expect(mockCityRepository.findById).not.toHaveBeenCalled();
            expect(mockBcrypt.hash).toHaveBeenCalledWith('password456', 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...userDtoWithoutCity,
                password: hashedPassword,
            });
            expect(result.user).toBeDefined();
        });
        it('should throw error when repository create returns null', async () => {
            const mockCity = { id: 1, name: 'São Paulo', stateId: 1 };
            const hashedPassword = 'hashedPassword123';
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.create = jest.fn().mockResolvedValue(null);
            await expect(createUserService.execute(validUserDto)).rejects.toThrow('Falha ao criar usuário');
        });
        it('should format user permissions correctly', async () => {
            const mockCity = { id: 1, name: 'São Paulo', stateId: 1 };
            const hashedPassword = 'hashedPassword123';
            const userWithPermissions = {
                id: 1,
                email: 'john.doe@test.com',
                permissions: [
                    {
                        permission: { id: 1, name: 'LOGS' },
                        granted: true,
                    },
                    {
                        permission: { id: 2, name: 'APPOINTMENTS' },
                        granted: false,
                    },
                ],
            };
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.create = jest
                .fn()
                .mockResolvedValue(userWithPermissions);
            const result = await createUserService.execute(validUserDto);
            expect(result.user).toBeDefined();
            if (result.user.permissions) {
                expect(Array.isArray(result.user.permissions)).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=create.service.test.js.map