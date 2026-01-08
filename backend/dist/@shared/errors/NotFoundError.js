"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT_FOUND = exports.NotFoundError = void 0;
const AppError_1 = require("./AppError");
class NotFoundError extends AppError_1.AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
exports.NOT_FOUND = 'NOT_FOUND';
//# sourceMappingURL=NotFoundError.js.map