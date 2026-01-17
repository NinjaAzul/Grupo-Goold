"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof errors_1.AppError) {
        if (process.env.NODE_ENV !== 'production') {
            utils_1.logger.error('[AppError Handler]', {
                message: err.message,
                statusCode: err.statusCode,
                name: err.name,
                stack: err.stack,
            });
        }
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                statusCode: err.statusCode,
                name: err.name,
            },
        });
    }
    utils_1.logger.error('[Unexpected Error]', err);
    return res.status(500).json({
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message,
            statusCode: 500,
            name: 'InternalServerError',
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map