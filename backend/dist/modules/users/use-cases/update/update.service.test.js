"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_service_1 = require("./update.service");
const user_repository_1 = require("../../repositories/user.repository");
const city_repository_1 = require("@modules/cities/repositories/city.repository");
const role_repository_1 = require("@modules/roles/repositories/role.repository");
const user_model_1 = require("@modules/users/model/user.model");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Mocks
jest.mock('bcrypt');
jest.mock('../../repositories/user.repository');
jest.mock('@modules/cities/repositories/city.repository');
jest.mock('@modules/roles/repositories/role.repository');
jest.mock('@modules/users/model/user.model');
jest.mock('@shared/utils/logger.service');
describe('UpdateUserService', () => {
    let updateUserService;
    let mockUserRepository;
    let mockCityRepository;
    let mockRoleRepository;
    const mockUserModel = user_model_1.UserModel;
    const mockBcrypt = bcrypt_1.default;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        mockCityRepository = new city_repository_1.CityRepository();
        mockRoleRepository = new role_repository_1.RoleRepository();
        updateUserService = new update_service_1.UpdateUserService();
        updateUserService.userRepository = mockUserRepository;
        updateUserService.cityRepository = mockCityRepository;
        updateUserService.roleRepository = mockRoleRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const existingUser = {
            id: 1,
            email: 'existing@test.com',
            firstName: 'John',
            lastName: 'Doe',
        };
        it('should throw NotFoundError when user does not exist', async () => {
            mockUserModel.findByPk = jest.fn().mockResolvedValue(null);
            const updateRequest = {
                userId: 999,
                firstName: 'Updated',
            };
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow('Usuário não encontrado');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(999);
        });
        it('should throw BadRequestError when email is already in use by another user', async () => {
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(true);
            const updateRequest = {
                userId: 1,
                email: 'newemail@test.com',
            };
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow(errors_1.BadRequestError);
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow('Este e-mail já está em uso');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('newemail@test.com');
        });
        it('should allow updating email to the same email', async () => {
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockUserRepository.update = jest.fn().mockResolvedValue({
                ...existingUser,
                firstName: 'Updated',
            });
            const updateRequest = {
                userId: 1,
                email: 'existing@test.com',
                firstName: 'Updated',
            };
            await updateUserService.execute(updateRequest);
            expect(mockUserModel.findOne).not.toHaveBeenCalled();
            expect(mockUserRepository.update).toHaveBeenCalled();
        });
        it('should throw NotFoundError when city does not exist', async () => {
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockCityRepository.findById = jest.fn().mockResolvedValue(null);
            const updateRequest = {
                userId: 1,
                cityId: 999,
            };
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow('Cidade não encontrada');
            expect(mockCityRepository.findById).toHaveBeenCalledWith(999);
        });
        it('should throw NotFoundError when role does not exist', async () => {
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockRoleRepository.findById = jest.fn().mockResolvedValue(null);
            const updateRequest = {
                userId: 1,
                roleId: 999,
            };
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow('Perfil não encontrado');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockRoleRepository.findById).toHaveBeenCalledWith(999);
        });
        it('should hash password when password is provided', async () => {
            const hashedPassword = 'hashedPassword123';
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.update = jest.fn().mockResolvedValue({
                ...existingUser,
            });
            const updateRequest = {
                userId: 1,
                password: 'newPassword123',
            };
            await updateUserService.execute(updateRequest);
            expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
            expect(mockUserRepository.update).toHaveBeenCalledWith(expect.objectContaining({
                password: hashedPassword,
            }));
        });
        it('should update user successfully without password', async () => {
            const updatedUser = {
                ...existingUser,
                firstName: 'Updated',
            };
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockUserRepository.update = jest
                .fn()
                .mockResolvedValue(updatedUser);
            const updateRequest = {
                userId: 1,
                firstName: 'Updated',
            };
            const result = await updateUserService.execute(updateRequest);
            expect(mockBcrypt.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.update).toHaveBeenCalledWith(updateRequest);
            expect(result.user).toEqual(updatedUser);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Atualização de perfil', 'Minha Conta', 1, 'Usuário existing@test.com atualizou perfil');
        });
        it('should update user successfully with all validations passing', async () => {
            const mockCity = { id: 1, name: 'São Paulo', stateId: 1 };
            const mockRole = { id: 2, name: 'USER' };
            const hashedPassword = 'hashedPassword123';
            const updatedUser = {
                ...existingUser,
                firstName: 'Updated',
                cityId: 1,
                roleId: 2,
            };
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockUserRepository.emailExists = jest.fn().mockResolvedValue(false);
            mockCityRepository.findById = jest.fn().mockResolvedValue(mockCity);
            mockRoleRepository.findById = jest.fn().mockResolvedValue(mockRole);
            mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
            mockUserRepository.update = jest
                .fn()
                .mockResolvedValue(updatedUser);
            const updateRequest = {
                userId: 1,
                firstName: 'Updated',
                email: 'newemail@test.com',
                cityId: 1,
                roleId: 2,
                password: 'newPassword123',
            };
            const result = await updateUserService.execute(updateRequest);
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith('newemail@test.com');
            expect(mockCityRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRoleRepository.findById).toHaveBeenCalledWith(2);
            expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
            expect(result.user).toEqual(updatedUser);
        });
        it('should throw NotFoundError when repository update returns null', async () => {
            mockUserModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingUser);
            mockUserRepository.update = jest.fn().mockResolvedValue(null);
            const updateRequest = {
                userId: 1,
                firstName: 'Updated',
            };
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateUserService.execute(updateRequest)).rejects.toThrow('Usuário não encontrado');
        });
    });
});
//# sourceMappingURL=update.service.test.js.map