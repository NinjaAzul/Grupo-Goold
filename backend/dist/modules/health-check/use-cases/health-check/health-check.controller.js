"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckHealthController = void 0;
const health_check_service_1 = require("./health-check.service");
class CheckHealthController {
    constructor() {
        this.handle = async (_req, res) => {
            try {
                const response = await this.checkHealthService.execute();
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Internal server error',
                    timestamp: new Date().toISOString(),
                });
            }
        };
        this.checkHealthService = new health_check_service_1.CheckHealthService();
    }
}
exports.CheckHealthController = CheckHealthController;
//# sourceMappingURL=health-check.controller.js.map