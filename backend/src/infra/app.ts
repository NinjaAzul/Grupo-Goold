import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { routes } from './http/routes';
import { errorHandler, notFoundHandler } from '@shared/middlewares';
import { getSwaggerSpec } from '@shared/config/swagger';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api-docs.json', (_req, res) => {
  const swaggerSpec = getSwaggerSpec();
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use(
  '/api-docs',
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const swaggerSpec = getSwaggerSpec();
    swaggerUi.setup(swaggerSpec)(req, res, next);
  }
);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
