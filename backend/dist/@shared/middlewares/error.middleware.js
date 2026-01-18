"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const error_formatter_1 = require("../utils/error-formatter");
const errorHandler = (err, req, res, _next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const errorId = (0, error_formatter_1.generateErrorId)();
    if (err instanceof errors_1.AppError) {
        const formattedLog = (0, error_formatter_1.formatErrorForLog)(err, {
            errorId,
            statusCode: err.statusCode,
            path: req.path,
            method: req.method,
        });
        utils_1.logger.error('[AppError Handler]', formattedLog);
        const response = (0, error_formatter_1.formatErrorForResponse)(err, errorId, isProduction);
        return res.status(err.statusCode).json(response);
    }
    const unexpectedError = err;
    unexpectedError.statusCode = 500;
    const formattedLog = (0, error_formatter_1.formatErrorForLog)(unexpectedError, {
        errorId,
        statusCode: 500,
        path: req.path,
        method: req.method,
    });
    utils_1.logger.error('[Unexpected Error]', formattedLog);
    const response = (0, error_formatter_1.formatErrorForResponse)(unexpectedError, errorId, isProduction);
    return res.status(500).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map