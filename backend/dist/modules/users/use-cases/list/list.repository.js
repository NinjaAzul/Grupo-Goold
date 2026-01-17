"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersRepository = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("@modules/users/model/user.model");
const roles_1 = require("@modules/roles");
const city_model_1 = require("@modules/cities/model/city.model");
const permissions_1 = require("@modules/permissions");
class ListUsersRepository {
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.name) {
            where[sequelize_1.Op.or] = [
                { firstName: { [sequelize_1.Op.like]: `%${filters.name}%` } },
                { lastName: { [sequelize_1.Op.like]: `%${filters.name}%` } },
            ];
        }
        if (filters.email) {
            where.email = { [sequelize_1.Op.like]: `%${filters.email}%` };
        }
        if (filters.roleId) {
            where.roleId = filters.roleId;
        }
        if (filters.cityId) {
            where.cityId = filters.cityId;
        }
        if (filters.active !== undefined) {
            where.active = filters.active;
        }
        if (filters.startDate || filters.endDate) {
            const dateFilter = {};
            if (filters.startDate) {
                dateFilter[sequelize_1.Op.gte] = new Date(filters.startDate);
            }
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                dateFilter[sequelize_1.Op.lte] = endDate;
            }
            if (Object.keys(dateFilter).length > 0) {
                where.createdAt = dateFilter;
            }
        }
        const { count, rows } = await user_model_1.UserModel.findAndCountAll({
            where,
            include: [
                {
                    model: roles_1.RoleModel,
                    as: 'role',
                },
                {
                    model: city_model_1.CityModel,
                    as: 'city',
                },
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
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        // Mapear usuários e formatar permissões corretamente
        const users = rows.map((user) => {
            const userJson = user.toJSON();
            // Formatar permissões para o formato esperado
            // Sequelize retorna através do through model como UserPermissionModel (nome do modelo)
            if (userJson.permissions && Array.isArray(userJson.permissions)) {
                userJson.permissions = userJson.permissions.map((perm) => {
                    // O Sequelize retorna o through model como UserPermissionModel (nome do modelo)
                    // O MySQL retorna tinyint(1) como 0 ou 1, então precisamos converter para boolean
                    let grantedValue = false;
                    const userPermissionModel = perm.UserPermissionModel;
                    // Verificar e converter para boolean
                    if (userPermissionModel?.granted !== undefined) {
                        grantedValue = Boolean(userPermissionModel.granted);
                    }
                    return {
                        permission: {
                            id: perm.id,
                            name: perm.name,
                        },
                        granted: grantedValue,
                    };
                });
            }
            return userJson;
        });
        return {
            users,
            total: count,
        };
    }
}
exports.ListUsersRepository = ListUsersRepository;
//# sourceMappingURL=list.repository.js.map