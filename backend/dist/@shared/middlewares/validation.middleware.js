"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const errors_1 = require("@shared/errors");
const validationMiddleware = (dtoClass) => {
    return async (req, _res, next) => {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            const messages = errors.map((error) => {
                return Object.values(error.constraints || {}).join(', ');
            });
            throw new errors_1.BadRequestError(messages.join('; '));
        }
        req.body = dto;
        next();
    };
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map