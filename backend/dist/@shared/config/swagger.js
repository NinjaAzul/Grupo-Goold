"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.getSwaggerSpec = getSwaggerSpec;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Grupo Goold API',
        version: '1.0.0',
        description: 'Documentação da API do projeto Grupo Goold',
        contact: {
            name: 'Grupo Goold',
        },
    },
    servers: [
        {
            url: 'http://localhost:3001/api',
            description: 'Servidor de desenvolvimento',
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
// Determina se está em desenvolvimento ou produção
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
// Função para gerar o Swagger spec dinamicamente
function getSwaggerSpec() {
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
        console.log('Swagger paths:', options.apis);
        console.log('Swagger spec generated:', Object.keys(swaggerSpec.paths || {}).length, 'paths');
    }
    return swaggerSpec;
}
// Exporta a função e também o spec inicial para compatibilidade
const swaggerSpec = getSwaggerSpec();
exports.swaggerSpec = swaggerSpec;
//# sourceMappingURL=swagger.js.map