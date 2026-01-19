import { Router } from 'express';

import {
  healthCheckRoutes,
  createUserRoutes,
  loginRoutes,
  checkEmailRoutes,
  listUsersRoutes,
  updateUserRoutes,
  updateProfileRoutes,
  deleteUserRoutes,
  getProfileRoutes,
  syncStatesRoutes,
  listStatesRoutes,
  listCitiesRoutes,
  searchByCEPRoutes,
  listLogsRoutes,
  myLogsRoutes,
} from '@modules/routes';
import { createAppointmentRoutes } from '@modules/appointments/use-cases/create/create.routes';
import { listAppointmentsRoutes } from '@modules/appointments/use-cases/list/list.routes';
import { adminListAppointmentsRoutes } from '@modules/appointments/use-cases/admin-list/admin-list.routes';
import { availableSlotsRoutes } from '@modules/appointments/use-cases/available-slots/available-slots.routes';
import { availableRoomsRoutes } from '@modules/appointments/use-cases/available-rooms/available-rooms.routes';
import { cancelAppointmentRoutes } from '@modules/appointments/use-cases/cancel/cancel.routes';
import { updateStatusRoutes } from '@modules/appointments/use-cases/update-status/update-status.routes';
import { roomsRoutes } from '@modules/rooms/use-cases/rooms.routes';
import { listRoomsRoutes } from '@modules/rooms/use-cases/list/list.routes';
import { updateUserPermissionRoutes } from '@modules/users/use-cases/update-permission/update-permission.routes';

const routes = Router();

//HEALTH CHECK ROUTES
routes.use('/health', healthCheckRoutes);

//USERS ROUTES
routes.use('/users', createUserRoutes);
routes.use('/users', listUsersRoutes);
routes.use('/users', updateProfileRoutes);
routes.use('/users', updateUserRoutes);
routes.use('/users', deleteUserRoutes);
routes.use('/users', updateUserPermissionRoutes);
routes.use('/users', getProfileRoutes);
routes.use('/users', checkEmailRoutes);
routes.use('/users/login', loginRoutes);

//STATES ROUTES
routes.use('/states', syncStatesRoutes);
routes.use('/states', listStatesRoutes);

//CITIES ROUTES
routes.use('/cities', listCitiesRoutes);
routes.use('/cities', searchByCEPRoutes);

//APPOINTMENTS ROUTES
routes.use('/appointments', createAppointmentRoutes);
routes.use('/appointments', listAppointmentsRoutes);
routes.use('/appointments', availableSlotsRoutes);
routes.use('/appointments', availableRoomsRoutes);
routes.use('/appointments', cancelAppointmentRoutes);

//ROOMS ROUTES
routes.use('/rooms', listRoomsRoutes);

//ADMIN ROUTES
routes.use('/admin/appointments', adminListAppointmentsRoutes);
routes.use('/admin/appointments', updateStatusRoutes);
routes.use('/admin/rooms', roomsRoutes);

//LOGS ROUTES
routes.use('/logs', listLogsRoutes);
routes.use('/logs', myLogsRoutes);

export { routes };
