"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheckRoutes = exports.CheckHealthService = exports.CheckHealthController = void 0;
var health_check_controller_1 = require("./health-check.controller");
Object.defineProperty(exports, "CheckHealthController", { enumerable: true, get: function () { return health_check_controller_1.CheckHealthController; } });
var health_check_service_1 = require("./health-check.service");
Object.defineProperty(exports, "CheckHealthService", { enumerable: true, get: function () { return health_check_service_1.CheckHealthService; } });
var health_check_routes_1 = require("./health-check.routes");
Object.defineProperty(exports, "healthCheckRoutes", { enumerable: true, get: function () { return health_check_routes_1.healthCheckRoutes; } });
__exportStar(require("./health-check.interface"), exports);
//# sourceMappingURL=index.js.map