import { Router } from 'express';
import { healthCheckRoutes } from './health-check.routes';

const routes = Router();

routes.use('/health', healthCheckRoutes);

export { routes };
