"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_service_1 = require("./delete.service");
const user_repository_1 = require("../../repositories/user.repository");
const user_model_1 = require("@modules/users/model/user.model");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const errors_1 = require("@shared/errors");
const constants_1 = require("@/@shared/constants");
const logger_service_1 = require("@shared/utils/logger.service");
// Mocks
jest.mock('../../repositories/user.repository');
jest.mock('@modules/users/model/user.model');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');
describe('DeleteUserService', () => {
    let deleteUserService;
    let mockUserRepository;
    const mockUserModel = user_model_1.UserModel;
    const mockAppointmentModel = appointment_model_1.AppointmentModel;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockUserRepository = new user_repository_1.UserRepository();
        deleteUserService = new delete_service_1.DeleteUserService();
        deleteUserService.userRepository = mockUserRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        it('should throw NotFoundError when user does not exist', async () => {
            mockUserModel.findByPk = jest.fn().mockResolvedValue(null);
            await expect(deleteUserService.execute(999)).rejects.toThrow(errors_1.NotFoundError);
            await expect(deleteUserService.execute(999)).rejects.toThrow('Usuário não encontrado');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(999);
        });
        it('should throw BadRequestError when trying to delete the last admin', async () => {
            const adminUser = {
                id: 1,
                email: 'admin@test.com',
                roleId: constants_1.ROLES.ADMIN,
            };
            mockUserModel.findByPk = jest.fn().mockResolvedValue(adminUser);
            mockUserModel.count = jest.fn().mockResolvedValue(1);
            await expect(deleteUserService.execute(1)).rejects.toThrow(errors_1.BadRequestError);
            await expect(deleteUserService.execute(1)).rejects.toThrow('Não é possível excluir o último usuário administrador. Deve existir pelo menos um administrador.');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockUserModel.count).toHaveBeenCalledWith({
                where: { roleId: constants_1.ROLES.ADMIN },
            });
        });
        it('should allow deleting admin when there are multiple admins', async () => {
            const adminUser = {
                id: 1,
                email: 'admin@test.com',
                roleId: constants_1.ROLES.ADMIN,
            };
            mockUserModel.findByPk = jest.fn().mockResolvedValue(adminUser);
            mockUserModel.count = jest.fn().mockResolvedValue(2);
            mockAppointmentModel.count = jest.fn().mockResolvedValue(0);
            mockUserRepository.delete = jest.fn().mockResolvedValue(true);
            await deleteUserService.execute(1);
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockUserModel.count).toHaveBeenCalledWith({
                where: { roleId: constants_1.ROLES.ADMIN },
            });
            expect(mockAppointmentModel.count).toHaveBeenCalledWith({
                where: { userId: 1 },
            });
            expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
        });
        it('should throw BadRequestError when user has appointments', async () => {
            const user = {
                id: 2,
                email: 'user@test.com',
                roleId: constants_1.ROLES.USER,
            };
            mockUserModel.findByPk = jest.fn().mockResolvedValue(user);
            mockAppointmentModel.count = jest.fn().mockResolvedValue(5);
            await expect(deleteUserService.execute(2)).rejects.toThrow(errors_1.BadRequestError);
            await expect(deleteUserService.execute(2)).rejects.toThrow('Não é possível excluir o usuário. Existem 5 agendamento(s) associados a este usuário.');
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(2);
            expect(mockAppointmentModel.count).toHaveBeenCalledWith({
                where: { userId: 2 },
            });
        });
        it('should successfully delete user without appointments', async () => {
            const user = {
                id: 3,
                email: 'user@test.com',
                roleId: constants_1.ROLES.USER,
            };
            mockUserModel.findByPk = jest.fn().mockResolvedValue(user);
            mockAppointmentModel.count = jest.fn().mockResolvedValue(0);
            mockUserRepository.delete = jest.fn().mockResolvedValue(true);
            await deleteUserService.execute(3);
            expect(mockUserModel.findByPk).toHaveBeenCalledWith(3);
            expect(mockAppointmentModel.count).toHaveBeenCalledWith({
                where: { userId: 3 },
            });
            expect(mockUserRepository.delete).toHaveBeenCalledWith(3);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Exclusão de usuário', 'Minha Conta', 3, 'Usuário user@test.com foi excluído');
        });
        it('should throw NotFoundError when repository delete returns false', async () => {
            const user = {
                id: 4,
                email: 'user@test.com',
                roleId: constants_1.ROLES.USER,
            };
            mockUserModel.findByPk = jest.fn().mockResolvedValue(user);
            mockAppointmentModel.count = jest.fn().mockResolvedValue(0);
            mockUserRepository.delete = jest.fn().mockResolvedValue(false);
            await expect(deleteUserService.execute(4)).rejects.toThrow(errors_1.NotFoundError);
            await expect(deleteUserService.execute(4)).rejects.toThrow('Usuário não encontrado');
        });
    });
});
//# sourceMappingURL=delete.service.test.js.map