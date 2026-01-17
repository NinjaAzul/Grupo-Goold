"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserRepository = void 0;
const user_model_1 = require("../../model/user.model");
const constants_1 = require("@/@shared/constants");
const permissions_1 = require("@modules/permissions");
const user_permissions_1 = require("@modules/user-permissions");
const bcrypt_1 = __importDefault(require("bcrypt"));
class CreateUserRepository {
    async create(data) {
        const user = await user_model_1.UserModel.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: await bcrypt_1.default.hash(data.password, 10),
            roleId: data.roleId || constants_1.ROLES.USER,
            active: true, // Usuário criado já vem ativo
            zipCode: data.zipCode || null,
            street: data.street || null,
            number: data.number || null,
            complement: data.complement || null,
            neighborhood: data.neighborhood || null,
            cityId: data.cityId || null,
        });
        // Buscar permissões LOGS e APPOINTMENTS
        const permissions = await permissions_1.PermissionModel.findAll({
            where: {
                name: ['LOGS', 'APPOINTMENTS'],
            },
        });
        // Criar permissões para o usuário (todas ativas por padrão)
        if (permissions.length > 0) {
            const userPermissions = permissions.map((permission) => ({
                userId: user.id,
                permissionId: permission.id,
                granted: true,
            }));
            await user_permissions_1.UserPermissionModel.bulkCreate(userPermissions);
        }
        // Buscar usuário com permissões para retornar
        const userWithPermissions = await user_model_1.UserModel.findByPk(user.id, {
            include: [
                {
                    model: permissions_1.PermissionModel,
                    as: 'permissions',
                    through: {
                        attributes: ['granted'],
                    },
                    attributes: ['id', 'name'],
                },
            ],
            attributes: {
                exclude: ['password'],
            },
        });
        if (!userWithPermissions) {
            throw new Error('Failed to create user');
        }
        // Formatar permissões para o formato esperado
        const userJson = userWithPermissions.toJSON();
        if (userJson.permissions && Array.isArray(userJson.permissions)) {
            userJson.permissions = userJson.permissions.map((perm) => ({
                permission: {
                    id: perm.id,
                    name: perm.name,
                },
                granted: perm.user_permissions?.granted ??
                    perm.granted ??
                    false,
            }));
        }
        return userJson;
    }
}
exports.CreateUserRepository = CreateUserRepository;
//# sourceMappingURL=create.repository.js.map