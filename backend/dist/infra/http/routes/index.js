"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const routes_1 = require("@modules/routes");
const admin_routes_1 = require("@modules/appointments/use-cases/admin/admin.routes");
const create_routes_1 = require("@modules/appointments/use-cases/create/create.routes");
const list_routes_1 = require("@modules/appointments/use-cases/list/list.routes");
const available_slots_routes_1 = require("@modules/appointments/use-cases/available-slots/available-slots.routes");
const cancel_routes_1 = require("@modules/appointments/use-cases/cancel/cancel.routes");
const rooms_routes_1 = require("@modules/rooms/use-cases/rooms.routes");
const list_routes_2 = require("@modules/rooms/use-cases/list/list.routes");
const update_permission_routes_1 = require("@modules/users/use-cases/update-permission/update-permission.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
//HEALTH CHECK ROUTES
routes.use('/health', routes_1.healthCheckRoutes);
//USERS ROUTES
routes.use('/users', routes_1.createUserRoutes);
routes.use('/users', routes_1.listUsersRoutes);
routes.use('/users', routes_1.updateUserRoutes);
routes.use('/users', routes_1.deleteUserRoutes);
routes.use('/users', update_permission_routes_1.updateUserPermissionRoutes);
routes.use('/users', routes_1.getProfileRoutes);
routes.use('/users', routes_1.checkEmailRoutes);
routes.use('/users/login', routes_1.loginRoutes);
//STATES ROUTES
routes.use('/states', routes_1.syncStatesRoutes);
routes.use('/states', routes_1.listStatesRoutes);
//CITIES ROUTES
routes.use('/cities', routes_1.listCitiesRoutes);
routes.use('/cities', routes_1.searchByCEPRoutes);
//APPOINTMENTS ROUTES
routes.use('/appointments', create_routes_1.createAppointmentRoutes);
routes.use('/appointments', list_routes_1.listAppointmentsRoutes);
routes.use('/appointments', available_slots_routes_1.availableSlotsRoutes);
routes.use('/appointments', cancel_routes_1.cancelAppointmentRoutes);
//ROOMS ROUTES
routes.use('/rooms', list_routes_2.listRoomsRoutes);
//ADMIN ROUTES
routes.use('/admin', admin_routes_1.adminRoutes);
routes.use('/admin/rooms', rooms_routes_1.roomsRoutes);
//LOGS ROUTES
routes.use('/logs', routes_1.listLogsRoutes);
routes.use('/logs', routes_1.myLogsRoutes);
//# sourceMappingURL=index.js.map