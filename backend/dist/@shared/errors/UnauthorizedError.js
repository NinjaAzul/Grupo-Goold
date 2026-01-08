"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNAUTHORIZED = exports.UnauthorizedError = void 0;
const AppError_1 = require("./AppError");
class UnauthorizedError extends AppError_1.AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
exports.UNAUTHORIZED = 'UNAUTHORIZED';
//# sourceMappingURL=UnauthorizedError.js.map