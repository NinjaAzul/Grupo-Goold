"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRepository = void 0;
const user_model_1 = require("@modules/users/model/user.model");
const roles_1 = require("@modules/roles");
const city_model_1 = require("@modules/cities/model/city.model");
const errors_1 = require("@shared/errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UpdateUserRepository {
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
            throw new errors_1.NotFoundError('User not found');
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await user_model_1.UserModel.findOne({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new errors_1.BadRequestError('Email already in use');
            }
        }
        if (data.cityId) {
            const city = await city_model_1.CityModel.findByPk(data.cityId);
            if (!city) {
                throw new errors_1.NotFoundError('City not found');
            }
        }
        if (data.roleId) {
            const role = await roles_1.RoleModel.findByPk(data.roleId);
            if (!role) {
                throw new errors_1.NotFoundError('Role not found');
            }
        }
        const updateData = {};
        if (data.firstName !== undefined)
            updateData.firstName = data.firstName;
        if (data.lastName !== undefined)
            updateData.lastName = data.lastName;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.password !== undefined) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
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
        return updatedUser.toJSON();
    }
}
exports.UpdateUserRepository = UpdateUserRepository;
//# sourceMappingURL=update.repository.js.map