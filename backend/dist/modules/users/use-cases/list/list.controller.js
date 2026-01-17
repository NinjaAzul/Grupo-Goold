"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersController = void 0;
const list_service_1 = require("./list.service");
class ListUsersController {
    constructor() {
        this.service = new list_service_1.ListUsersService();
    }
    async handle(req, res, next) {
        try {
            const filters = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                name: req.query.name,
                email: req.query.email,
                roleId: req.query.roleId ? Number(req.query.roleId) : undefined,
                cityId: req.query.cityId ? Number(req.query.cityId) : undefined,
                active: typeof req.query.active === 'string'
                    ? req.query.active.toLowerCase() === 'true'
                    : undefined,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.service.execute(filters);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ListUsersController = ListUsersController;
//# sourceMappingURL=list.controller.js.map