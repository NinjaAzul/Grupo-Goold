"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const create_service_1 = require("./create.service");
class CreateUserController {
    constructor() {
        this.handle = async (req, res) => {
            const request = req.body;
            const response = await this.createUserService.execute(request);
            return res.status(201).json(response);
        };
        this.createUserService = new create_service_1.CreateUserService();
    }
}
exports.CreateUserController = CreateUserController;
//# sourceMappingURL=create.controller.js.map