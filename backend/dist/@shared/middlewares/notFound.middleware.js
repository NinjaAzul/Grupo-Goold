"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const errors_1 = require("../errors");
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        error: {
            message: 'Route not found',
            statusCode: 404,
            name: errors_1.NOT_FOUND,
        },
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.middleware.js.map