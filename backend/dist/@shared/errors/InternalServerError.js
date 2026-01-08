"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_SERVER_ERROR = exports.InternalServerError = void 0;
const AppError_1 = require("./AppError");
class InternalServerError extends AppError_1.AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
exports.INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
//# sourceMappingURL=InternalServerError.js.map