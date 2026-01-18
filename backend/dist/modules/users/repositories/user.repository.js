"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("../model/user.model");
const constants_1 = require("@/@shared/constants");
const permissions_1 = require("@modules/permissions");
const user_permissions_1 = require("@modules/user-permissions");
const roles_1 = require("@modules/roles");
const city_model_1 = require("@modules/cities/model/city.model");
class UserRepository {
    formatPermissions(user) {
        const userJson = user.toJSON();
        if (userJson.permissions && Array.isArray(userJson.permissions)) {
            return userJson.permissions.map((perm) => {
                let grantedValue = false;
                const userPermissionModel = perm.UserPermissionModel;
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
        return undefined;
    }
    async create(data) {
        const user = await user_model_1.UserModel.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            roleId: constants_1.ROLES.USER,
            active: true,
            zipCode: data.zipCode || null,
            street: data.street || null,
            number: data.number || null,
            complement: data.complement || null,
            neighborhood: data.neighborhood || null,
            cityId: data.cityId || null,
        });
        const permissions = await permissions_1.PermissionModel.findAll({
            where: {
                name: ['LOGS', 'APPOINTMENTS'],
            },
        });
        if (permissions.length > 0) {
            const userPermissions = permissions.map((permission) => ({
                userId: user.id,
                permissionId: permission.id,
                granted: true,
            }));
            await user_permissions_1.UserPermissionModel.bulkCreate(userPermissions);
        }
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
            return null;
        }
        const userJson = userWithPermissions.toJSON();
        const formattedPermissions = this.formatPermissions(userWithPermissions);
        return {
            ...userJson,
            permissions: formattedPermissions,
        };
    }
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
        const users = rows.map((user) => {
            const userJson = user.toJSON();
            const formattedPermissions = this.formatPermissions(user);
            return {
                ...userJson,
                permissions: formattedPermissions,
            };
        });
        return {
            users,
            total: count,
        };
    }
    async findById(userId, options = {
        includeRole: true,
        includeCity: true,
        includePermissions: true,
        excludePassword: true,
    }) {
        const include = [];
        if (options.includeRole) {
            include.push({
                model: roles_1.RoleModel,
                as: 'role',
            });
        }
        if (options.includeCity) {
            include.push({
                model: city_model_1.CityModel,
                as: 'city',
            });
        }
        if (options.includePermissions) {
            include.push({
                model: permissions_1.PermissionModel,
                as: 'permissions',
                through: {
                    attributes: ['granted'],
                },
                attributes: ['id', 'name'],
            });
        }
        const user = await user_model_1.UserModel.findByPk(userId, {
            include,
            attributes: options.excludePassword
                ? {
                    exclude: ['password'],
                }
                : undefined,
        });
        if (!user) {
            return null;
        }
        const userJson = user.toJSON();
        const formattedPermissions = options.includePermissions
            ? this.formatPermissions(user)
            : undefined;
        return {
            ...userJson,
            permissions: formattedPermissions,
        };
    }
    async findByEmail(email, options = {
        includePermissions: true,
        excludePassword: false,
    }) {
        const include = [];
        if (options.includePermissions) {
            include.push({
                model: permissions_1.PermissionModel,
                as: 'permissions',
                through: {
                    attributes: ['granted'],
                },
                attributes: ['id', 'name'],
            });
        }
        const user = await user_model_1.UserModel.findOne({
            where: { email },
            include,
            attributes: options.excludePassword
                ? {
                    exclude: ['password'],
                }
                : undefined,
        });
        if (!user) {
            return null;
        }
        const userJson = user.toJSON();
        const formattedPermissions = options.includePermissions
            ? this.formatPermissions(user)
            : undefined;
        return {
            ...userJson,
            permissions: formattedPermissions,
        };
    }
    async emailExists(email) {
        const user = await user_model_1.UserModel.findOne({
            where: { email },
            attributes: ['id'],
        });
        return !!user;
    }
    async update(data) {
        const user = await user_model_1.UserModel.findByPk(data.userId, {
            include: [
                {
                    model: roles_1.RoleModel,
                    as: 'role',
                },
                {
                    model: city_model_1.CityModel,
                    as: 'city',
                },
            ],
        });
        if (!user) {
            return null;
        }
        const updateData = {};
        if (data.firstName !== undefined)
            updateData.firstName = data.firstName;
        if (data.lastName !== undefined)
            updateData.lastName = data.lastName;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.password !== undefined)
            updateData.password = data.password;
        if (data.roleId !== undefined)
            updateData.roleId = data.roleId;
        if (data.active !== undefined)
            updateData.active = data.active;
        if (data.zipCode !== undefined)
            updateData.zipCode = data.zipCode || null;
        if (data.street !== undefined)
            updateData.street = data.street || null;
        if (data.number !== undefined)
            updateData.number = data.number || null;
        if (data.complement !== undefined)
            updateData.complement = data.complement || null;
        if (data.neighborhood !== undefined)
            updateData.neighborhood = data.neighborhood || null;
        if (data.cityId !== undefined)
            updateData.cityId = data.cityId || null;
        await user.update(updateData);
        const updatedUser = await user_model_1.UserModel.findByPk(data.userId, {
            include: [
                {
                    model: roles_1.RoleModel,
                    as: 'role',
                },
                {
                    model: city_model_1.CityModel,
                    as: 'city',
                },
            ],
            attributes: {
                exclude: ['password'],
            },
        });
        return updatedUser ? updatedUser.toJSON() : null;
    }
    async delete(userId) {
        const user = await user_model_1.UserModel.findByPk(userId);
        if (!user) {
            return false;
        }
        await user.destroy();
        return true;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map