"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const login_service_1 = require("./login.service");
class LoginController {
    constructor() {
        this.handle = async (req, res, next) => {
            try {
                const request = req.body;
                const response = await this.loginService.execute(request);
                return res.status(200).json(response);
            }
            catch (error) {
                return next(error);
            }
        };
        this.loginService = new login_service_1.LoginService();
    }
}
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map