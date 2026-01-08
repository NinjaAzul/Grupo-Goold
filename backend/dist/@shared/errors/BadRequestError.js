"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAD_REQUEST = exports.BadRequestError = void 0;
const AppError_1 = require("./AppError");
class BadRequestError extends AppError_1.AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
exports.BAD_REQUEST = 'BAD_REQUEST';
//# sourceMappingURL=BadRequestError.js.map