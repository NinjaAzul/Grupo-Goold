"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckEmailController = void 0;
const check_email_service_1 = require("./check-email.service");
class CheckEmailController {
    constructor() {
        this.handle = async (req, res, next) => {
            try {
                const request = req.body;
                const response = await this.checkEmailService.execute(request);
                return res.status(200).json(response);
            }
            catch (error) {
                return next(error);
            }
        };
        this.checkEmailService = new check_email_service_1.CheckEmailService();
    }
}
exports.CheckEmailController = CheckEmailController;
//# sourceMappingURL=check-email.controller.js.map