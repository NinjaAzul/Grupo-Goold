import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

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

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/infra/http/routes/**/*.ts',
    './src/modules/**/*.ts',
    './dist/infra/http/routes/**/*.js',
    './dist/modules/**/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
