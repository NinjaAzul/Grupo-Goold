"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myLogsRoutes = exports.listLogsRoutes = exports.searchByCEPRoutes = exports.listCitiesRoutes = exports.listStatesRoutes = exports.syncStatesRoutes = exports.getProfileRoutes = exports.deleteUserRoutes = exports.updateProfileRoutes = exports.updateUserRoutes = exports.listUsersRoutes = exports.checkEmailRoutes = exports.loginRoutes = exports.createUserRoutes = exports.healthCheckRoutes = void 0;
//APP
var health_check_routes_1 = require("./health-check/use-cases/health-check/health-check.routes");
Object.defineProperty(exports, "healthCheckRoutes", { enumerable: true, get: function () { return health_check_routes_1.healthCheckRoutes; } });
//USERS
var create_routes_1 = require("./users/use-cases/create/create.routes");
Object.defineProperty(exports, "createUserRoutes", { enumerable: true, get: function () { return create_routes_1.createUserRoutes; } });
var login_routes_1 = require("./users/use-cases/login/login.routes");
Object.defineProperty(exports, "loginRoutes", { enumerable: true, get: function () { return login_routes_1.loginRoutes; } });
var check_email_routes_1 = require("./users/use-cases/check-email/check-email.routes");
Object.defineProperty(exports, "checkEmailRoutes", { enumerable: true, get: function () { return check_email_routes_1.checkEmailRoutes; } });
var list_routes_1 = require("./users/use-cases/list/list.routes");
Object.defineProperty(exports, "listUsersRoutes", { enumerable: true, get: function () { return list_routes_1.listUsersRoutes; } });
var update_routes_1 = require("./users/use-cases/update/update.routes");
Object.defineProperty(exports, "updateUserRoutes", { enumerable: true, get: function () { return update_routes_1.updateUserRoutes; } });
var update_profile_routes_1 = require("./users/use-cases/update-profile/update-profile.routes");
Object.defineProperty(exports, "updateProfileRoutes", { enumerable: true, get: function () { return update_profile_routes_1.updateProfileRoutes; } });
var delete_routes_1 = require("./users/use-cases/delete/delete.routes");
Object.defineProperty(exports, "deleteUserRoutes", { enumerable: true, get: function () { return delete_routes_1.deleteUserRoutes; } });
var profile_routes_1 = require("./users/use-cases/get/profile.routes");
Object.defineProperty(exports, "getProfileRoutes", { enumerable: true, get: function () { return profile_routes_1.getProfileRoutes; } });
//STATES
var sync_routes_1 = require("./states/use-cases/sync/sync.routes");
Object.defineProperty(exports, "syncStatesRoutes", { enumerable: true, get: function () { return sync_routes_1.syncStatesRoutes; } });
var list_routes_2 = require("./states/use-cases/list/list.routes");
Object.defineProperty(exports, "listStatesRoutes", { enumerable: true, get: function () { return list_routes_2.listStatesRoutes; } });
//CITIES
var list_routes_3 = require("./cities/use-cases/list/list.routes");
Object.defineProperty(exports, "listCitiesRoutes", { enumerable: true, get: function () { return list_routes_3.listCitiesRoutes; } });
var search_by_cep_routes_1 = require("./cities/use-cases/search-by-cep/search-by-cep.routes");
Object.defineProperty(exports, "searchByCEPRoutes", { enumerable: true, get: function () { return search_by_cep_routes_1.searchByCEPRoutes; } });
//LOGS
var list_routes_4 = require("./logs/use-cases/list/list.routes");
Object.defineProperty(exports, "listLogsRoutes", { enumerable: true, get: function () { return list_routes_4.listLogsRoutes; } });
var my_logs_routes_1 = require("./logs/use-cases/my-logs/my-logs.routes");
Object.defineProperty(exports, "myLogsRoutes", { enumerable: true, get: function () { return my_logs_routes_1.myLogsRoutes; } });
//# sourceMappingURL=routes.js.map