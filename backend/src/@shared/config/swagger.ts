import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition, OAS3Definition } from 'swagger-jsdoc';
import path from 'path';
import { logger } from '../utils/logger';

const getServerUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  if (process.env.API_URL) {
    return `${process.env.API_URL}/api`;
  }
  return 'http://localhost:3001/api';
};

const swaggerDefinition: SwaggerDefinition = {
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
      url: getServerUrl(),
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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

function getSwaggerSpec(): OAS3Definition {
  const swaggerSpec = swaggerJsdoc(options) as OAS3Definition;

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    logger.info('Swagger paths:', options.apis);
    logger.debug(
      'Swagger spec generated:',
      Object.keys(swaggerSpec.paths || {}).length,
      'paths'
    );
  }

  return swaggerSpec;
}

const swaggerSpec = getSwaggerSpec();
export { swaggerSpec, getSwaggerSpec };
