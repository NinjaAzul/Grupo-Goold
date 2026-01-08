"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserRepository = void 0;
const user_model_1 = require("../../model/user.model");
class CreateUserRepository {
    async create(data) {
        const user = await user_model_1.UserModel.create({
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            roleId: data.roleId || 2, // Default para USER (id 2)
            zipCode: data.zipCode || null,
            street: data.street || null,
            number: data.number || null,
            complement: data.complement || null,
            neighborhood: data.neighborhood || null,
            cityId: data.cityId || null,
        });
        return user.toJSON();
    }
}
exports.CreateUserRepository = CreateUserRepository;
//# sourceMappingURL=create.repository.js.map