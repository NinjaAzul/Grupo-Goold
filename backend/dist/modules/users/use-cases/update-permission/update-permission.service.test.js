"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const update_permission_service_1 = require("./update-permission.service");
const user_permission_repository_1 = require("@modules/user-permissions/repositories/user-permission.repository");
// Mocks
jest.mock('@modules/user-permissions/repositories/user-permission.repository');
describe('UpdateUserPermissionService', () => {
    let updateUserPermissionService;
    let mockUserPermissionRepository;
    beforeEach(() => {
        mockUserPermissionRepository =
            new user_permission_repository_1.UserPermissionRepository();
        updateUserPermissionService = new update_permission_service_1.UpdateUserPermissionService();
        updateUserPermissionService.userPermissionRepository = mockUserPermissionRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        it('should successfully grant permission', async () => {
            mockUserPermissionRepository.findUserById = jest
                .fn()
                .mockResolvedValue({ id: 1 });
            mockUserPermissionRepository.findPermissionById = jest
                .fn()
                .mockResolvedValue({ id: 2 });
            mockUserPermissionRepository.update = jest
                .fn()
                .mockResolvedValue(undefined);
            const result = await updateUserPermissionService.execute({
                userId: 1,
                permissionId: 2,
                granted: true,
            });
            expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
            expect(mockUserPermissionRepository.findPermissionById).toHaveBeenCalledWith(2);
            expect(mockUserPermissionRepository.update).toHaveBeenCalledWith({
                userId: 1,
                permissionId: 2,
                granted: true,
            });
            expect(result.success).toBe(true);
            expect(result.message).toBe('User permission updated successfully');
        });
        it('should successfully revoke permission', async () => {
            mockUserPermissionRepository.findUserById = jest
                .fn()
                .mockResolvedValue({ id: 1 });
            mockUserPermissionRepository.findPermissionById = jest
                .fn()
                .mockResolvedValue({ id: 2 });
            mockUserPermissionRepository.update = jest
                .fn()
                .mockResolvedValue(undefined);
            const result = await updateUserPermissionService.execute({
                userId: 1,
                permissionId: 2,
                granted: false,
            });
            expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
            expect(mockUserPermissionRepository.findPermissionById).toHaveBeenCalledWith(2);
            expect(mockUserPermissionRepository.update).toHaveBeenCalledWith({
                userId: 1,
                permissionId: 2,
                granted: false,
            });
            expect(result.success).toBe(true);
            expect(result.message).toBe('User permission updated successfully');
        });
        it('should propagate NotFoundError when user does not exist', async () => {
            const { NotFoundError } = await Promise.resolve().then(() => __importStar(require('@shared/errors')));
            mockUserPermissionRepository.findUserById = jest
                .fn()
                .mockResolvedValue(null);
            await expect(updateUserPermissionService.execute({
                userId: 999,
                permissionId: 2,
                granted: true,
            })).rejects.toThrow(NotFoundError);
            await expect(updateUserPermissionService.execute({
                userId: 999,
                permissionId: 2,
                granted: true,
            })).rejects.toThrow('Usuário não encontrado');
            expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(999);
            expect(mockUserPermissionRepository.findPermissionById).not.toHaveBeenCalled();
            expect(mockUserPermissionRepository.update).not.toHaveBeenCalled();
        });
        it('should propagate NotFoundError when permission does not exist', async () => {
            const { NotFoundError } = await Promise.resolve().then(() => __importStar(require('@shared/errors')));
            mockUserPermissionRepository.findUserById = jest
                .fn()
                .mockResolvedValue({ id: 1 });
            mockUserPermissionRepository.findPermissionById = jest
                .fn()
                .mockResolvedValue(null);
            await expect(updateUserPermissionService.execute({
                userId: 1,
                permissionId: 999,
                granted: true,
            })).rejects.toThrow(NotFoundError);
            await expect(updateUserPermissionService.execute({
                userId: 1,
                permissionId: 999,
                granted: true,
            })).rejects.toThrow('Permissão não encontrada');
            expect(mockUserPermissionRepository.findUserById).toHaveBeenCalledWith(1);
            expect(mockUserPermissionRepository.findPermissionById).toHaveBeenCalledWith(999);
            expect(mockUserPermissionRepository.update).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=update-permission.service.test.js.map