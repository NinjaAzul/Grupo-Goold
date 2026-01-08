"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const config_1 = require("@shared/config");
const utils_1 = require("@shared/utils");
const environments_1 = require("@shared/environments");
require("./database/models");
async function startServer() {
    try {
        await (0, environments_1.validateEnvironment)();
        const PORT = process.env.PORT || 3001;
        await config_1.sequelize.authenticate();
        utils_1.logger.info('Database connection established successfully.');
        app_1.app.listen(PORT, () => {
            utils_1.logger.info(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        utils_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map