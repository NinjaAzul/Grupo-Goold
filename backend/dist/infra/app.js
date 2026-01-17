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
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            // Em desenvolvimento, permitir qualquer origem
            if (process.env.NODE_ENV !== 'production') {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Handler OPTIONS para CORS do Swagger
app.options('/api-docs.json', (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send();
});
app.get('/api-docs.json', (_req, res) => {
    try {
        const swaggerSpec = (0, swagger_1.getSwaggerSpec)();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.json(swaggerSpec);
    }
    catch (error) {
        console.error('Error generating Swagger spec:', error);
        res.status(500).json({ error: 'Failed to generate Swagger specification' });
    }
});
app.use('/api-docs', swagger_ui_express_1.default.serve, (req, res, next) => {
    const swaggerSpec = (0, swagger_1.getSwaggerSpec)();
    swagger_ui_express_1.default.setup(swaggerSpec)(req, res, next);
});
app.use('/api', routes_1.routes);
app.use(middlewares_1.notFoundHandler);
app.use(middlewares_1.errorHandler);
//# sourceMappingURL=app.js.map