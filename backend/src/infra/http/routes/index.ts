import { Router } from 'express';

import { healthCheckRoutes, createUserRoutes } from '@modules/routes';

const routes = Router();

routes.use('/health', healthCheckRoutes);
routes.use('/users', createUserRoutes);

export { routes };
