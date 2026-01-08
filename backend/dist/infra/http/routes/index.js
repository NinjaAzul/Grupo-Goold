"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const routes_1 = require("@modules/routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
//HEALTH CHECK
routes.use('/health', routes_1.healthCheckRoutes);
//USERS
routes.use('/users', routes_1.createUserRoutes);
//STATES
routes.use('/states', routes_1.syncStatesRoutes);
routes.use('/states', routes_1.listStatesRoutes);
//CITIES
routes.use('/cities', routes_1.listCitiesRoutes);
routes.use('/cities', routes_1.searchByCEPRoutes);
//# sourceMappingURL=index.js.map