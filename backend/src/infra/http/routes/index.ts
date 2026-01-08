import { Router } from 'express';

import {
  healthCheckRoutes,
  createUserRoutes,
  loginRoutes,
  listUsersRoutes,
  updateUserRoutes,
  deleteUserRoutes,
  getProfileRoutes,
  syncStatesRoutes,
  listStatesRoutes,
  listCitiesRoutes,
  searchByCEPRoutes,
  listLogsRoutes,
  myLogsRoutes,
} from '@modules/routes';
import { adminRoutes } from '@modules/appointments/use-cases/admin/admin.routes';
import { roomsRoutes } from '@modules/rooms/use-cases/rooms.routes';

const routes = Router();

//HEALTH CHECK ROUTES
routes.use('/health', healthCheckRoutes);

//USERS ROUTES
routes.use('/users', createUserRoutes);
routes.use('/users', listUsersRoutes);
routes.use('/users', updateUserRoutes);
routes.use('/users', deleteUserRoutes);
routes.use('/users', getProfileRoutes);
routes.use('/users/login', loginRoutes);

//STATES ROUTES
routes.use('/states', syncStatesRoutes);
routes.use('/states', listStatesRoutes);

//CITIES ROUTES
routes.use('/cities', listCitiesRoutes);
routes.use('/cities', searchByCEPRoutes);

//ADMIN ROUTES
routes.use('/admin', adminRoutes);
routes.use('/admin/rooms', roomsRoutes);

//LOGS ROUTES
routes.use('/logs', listLogsRoutes);
routes.use('/logs', myLogsRoutes);

export { routes };
