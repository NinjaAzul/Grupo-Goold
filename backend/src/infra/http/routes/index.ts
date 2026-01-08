import { Router } from 'express';

import {
  healthCheckRoutes,
  createUserRoutes,
  syncStatesRoutes,
  listStatesRoutes,
  listCitiesRoutes,
  searchByCEPRoutes,
} from '@modules/routes';

const routes = Router();

//HEALTH CHECK ROUTES
routes.use('/health', healthCheckRoutes);

//USERS ROUTES
routes.use('/users', createUserRoutes);

//STATES ROUTES
routes.use('/states', syncStatesRoutes);
routes.use('/states', listStatesRoutes);

//CITIES ROUTES
routes.use('/cities', listCitiesRoutes);
routes.use('/cities', searchByCEPRoutes);

export { routes };
