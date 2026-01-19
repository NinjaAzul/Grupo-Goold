"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const app_1 = require("./app");
const config_1 = require("@shared/config");
const utils_1 = require("@shared/utils");
const environments_1 = require("@shared/environments");
const error_formatter_1 = require("@shared/utils/error-formatter");
require("./database/models");
process.on('unhandledRejection', (reason, _promise) => {
    const errorId = (0, error_formatter_1.generateErrorId)();
    const error = reason instanceof Error
        ? reason
        : new Error(String(reason || 'Unhandled Rejection'));
    const formattedLog = (0, error_formatter_1.formatErrorForLog)(error, {
        errorId,
        path: 'process',
        method: 'unhandledRejection',
    });
    utils_1.logger.error('[Unhandled Rejection]', formattedLog);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});
process.on('uncaughtException', (error) => {
    const errorId = (0, error_formatter_1.generateErrorId)();
    const formattedLog = (0, error_formatter_1.formatErrorForLog)(error, {
        errorId,
        path: 'process',
        method: 'uncaughtException',
    });
    utils_1.logger.error('[Uncaught Exception]', formattedLog);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});
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
        const errorId = (0, error_formatter_1.generateErrorId)();
        const serverError = error instanceof Error
            ? error
            : new Error(String(error || 'Failed to start server'));
        const formattedLog = (0, error_formatter_1.formatErrorForLog)(serverError, {
            errorId,
            path: 'server',
            method: 'startServer',
        });
        utils_1.logger.error('Failed to start server', formattedLog);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map