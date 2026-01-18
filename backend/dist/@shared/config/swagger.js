"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.getSwaggerSpec = getSwaggerSpec;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Grupo Goold API',
        version: '1.0.0',
        description: 'Documentation for the Grupo Goold API',
        contact: {
            name: 'Grupo Goold',
        },
    },
    servers: [
        {
            url: 'http://localhost:3001/api',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};
const isDevelopment = process.env.NODE_ENV !== 'production';
const rootDir = isDevelopment
    ? path_1.default.join(__dirname, '../../..')
    : path_1.default.join(__dirname, '../..');
const options = {
    definition: swaggerDefinition,
    apis: isDevelopment
        ? [
            path_1.default.join(rootDir, 'src/infra/http/routes/**/*.ts'),
            path_1.default.join(rootDir, 'src/modules/**/*.ts'),
        ]
        : [
            path_1.default.join(rootDir, 'dist/infra/http/routes/**/*.js'),
            path_1.default.join(rootDir, 'dist/modules/**/*.js'),
        ],
};
function getSwaggerSpec() {
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    if (process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test') {
        logger_1.logger.info('Swagger paths:', options.apis);
        logger_1.logger.debug('Swagger spec generated:', Object.keys(swaggerSpec.paths || {}).length, 'paths');
    }
    return swaggerSpec;
}
const swaggerSpec = getSwaggerSpec();
exports.swaggerSpec = swaggerSpec;
//# sourceMappingURL=swagger.js.map