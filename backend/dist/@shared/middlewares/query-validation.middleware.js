"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidationMiddleware = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const errors_1 = require("@shared/errors");
const queryValidationMiddleware = (dtoClass) => {
    return async (req, _res, next) => {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.query);
            const errors = await (0, class_validator_1.validate)(dto, {
                whitelist: true,
                forbidNonWhitelisted: true,
                skipMissingProperties: true,
            });
            if (errors.length > 0) {
                const messages = errors.map((error) => {
                    return Object.values(error.constraints || {}).join(', ');
                });
                return next(new errors_1.BadRequestError(messages.join('; ')));
            }
            req.query = dto;
            next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.queryValidationMiddleware = queryValidationMiddleware;
//# sourceMappingURL=query-validation.middleware.js.map