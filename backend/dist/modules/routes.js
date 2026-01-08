"use strict";
// Centralized route exports
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByCEPRoutes = exports.listCitiesRoutes = exports.listStatesRoutes = exports.syncStatesRoutes = exports.createUserRoutes = exports.healthCheckRoutes = void 0;
//APP
var health_check_routes_1 = require("./health-check/use-cases/health-check/health-check.routes");
Object.defineProperty(exports, "healthCheckRoutes", { enumerable: true, get: function () { return health_check_routes_1.healthCheckRoutes; } });
//USERS
var create_routes_1 = require("./users/use-cases/create/create.routes");
Object.defineProperty(exports, "createUserRoutes", { enumerable: true, get: function () { return create_routes_1.createUserRoutes; } });
//STATES
var sync_routes_1 = require("./states/use-cases/sync/sync.routes");
Object.defineProperty(exports, "syncStatesRoutes", { enumerable: true, get: function () { return sync_routes_1.syncStatesRoutes; } });
var list_routes_1 = require("./states/use-cases/list/list.routes");
Object.defineProperty(exports, "listStatesRoutes", { enumerable: true, get: function () { return list_routes_1.listStatesRoutes; } });
//CITIES
var list_routes_2 = require("./cities/use-cases/list/list.routes");
Object.defineProperty(exports, "listCitiesRoutes", { enumerable: true, get: function () { return list_routes_2.listCitiesRoutes; } });
var search_by_cep_routes_1 = require("./cities/use-cases/search-by-cep/search-by-cep.routes");
Object.defineProperty(exports, "searchByCEPRoutes", { enumerable: true, get: function () { return search_by_cep_routes_1.searchByCEPRoutes; } });
//# sourceMappingURL=routes.js.map