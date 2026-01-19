/// <reference path="../@shared/types/express.d.ts" />
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { routes } from './http/routes';
import { errorHandler, notFoundHandler } from '@shared/middlewares';
import { getSwaggerSpec } from '@shared/config/swagger';
import { logger } from '@shared/utils/logger';

const app: Application = express();

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
   
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.FRONTEND_VERCEL_URL ? [process.env.FRONTEND_VERCEL_URL] : []),
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === 'production') {
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      if (process.env.FRONTEND_VERCEL_URL && origin === process.env.FRONTEND_VERCEL_URL) {
        return callback(null, true);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Log the rejected origin for debugging
    console.warn('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('/api-docs.json', (_req, res) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send();
});

app.get('/api-docs.json', (_req, res) => {
  try {
    const swaggerSpec = getSwaggerSpec();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Access-Control-Allow-Origin',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json(swaggerSpec);
  } catch (error) {
    logger.error('Error generating Swagger spec:', error);
    res.status(500).json({ error: 'Failed to generate Swagger specification' });
  }
});
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(getSwaggerSpec(), {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Grupo Goold API Documentation',
  })
);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
