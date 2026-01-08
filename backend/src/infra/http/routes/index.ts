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

//HEALTH CHECK
routes.use('/health', healthCheckRoutes);

//USERS
routes.use('/users', createUserRoutes);

//STATES
routes.use('/states', syncStatesRoutes);
routes.use('/states', listStatesRoutes);

//CITIES
routes.use('/cities', listCitiesRoutes);
routes.use('/cities', searchByCEPRoutes);

export { routes };
