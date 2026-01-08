import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition, OAS3Definition } from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition: SwaggerDefinition = {
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
  ? path.join(__dirname, '../../..')
  : path.join(__dirname, '../..');

const options = {
  definition: swaggerDefinition,
  apis: isDevelopment
    ? [
        path.join(rootDir, 'src/infra/http/routes/**/*.ts'),
        path.join(rootDir, 'src/modules/**/*.ts'),
      ]
    : [
        path.join(rootDir, 'dist/infra/http/routes/**/*.js'),
        path.join(rootDir, 'dist/modules/**/*.js'),
      ],
};

// Função para gerar o Swagger spec dinamicamente
function getSwaggerSpec(): OAS3Definition {
  const swaggerSpec = swaggerJsdoc(options) as OAS3Definition;

  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Swagger paths:', options.apis);
    console.log(
      'Swagger spec generated:',
      Object.keys(swaggerSpec.paths || {}).length,
      'paths'
    );
  }

  return swaggerSpec;
}

// Exporta a função e também o spec inicial para compatibilidade
const swaggerSpec = getSwaggerSpec();
export { swaggerSpec, getSwaggerSpec };
