"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
class ListUsersService {
    constructor() {
        this.repository = new user_repository_1.UserRepository();
    }
    async execute(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const { users, total } = await this.repository.findAll(filters);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.ListUsersService = ListUsersService;
//# sourceMappingURL=list.service.js.map