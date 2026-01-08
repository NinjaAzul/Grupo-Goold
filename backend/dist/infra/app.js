"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./http/routes");
const middlewares_1 = require("@shared/middlewares");
const swagger_1 = require("@shared/config/swagger");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api-docs.json', (_req, res) => {
    const swaggerSpec = (0, swagger_1.getSwaggerSpec)();
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/api-docs', swagger_ui_express_1.default.serve, (req, res, next) => {
    const swaggerSpec = (0, swagger_1.getSwaggerSpec)();
    swagger_ui_express_1.default.setup(swaggerSpec)(req, res, next);
});
app.use('/api', routes_1.routes);
app.use(middlewares_1.notFoundHandler);
app.use(middlewares_1.errorHandler);
//# sourceMappingURL=app.js.map