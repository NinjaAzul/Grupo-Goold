"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFLICT = exports.ConflictError = void 0;
const AppError_1 = require("./AppError");
class ConflictError extends AppError_1.AppError {
    constructor(message = 'Conflito') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
exports.CONFLICT = 'CONFLICT';
//# sourceMappingURL=ConflictError.js.map