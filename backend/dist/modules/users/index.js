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
exports.createUserRoutes = exports.UserModel = void 0;
// General exports
__exportStar(require("./model/user.interface"), exports);
var user_model_1 = require("./model/user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
// Use cases exports
__exportStar(require("./use-cases/create"), exports);
var create_1 = require("./use-cases/create");
Object.defineProperty(exports, "createUserRoutes", { enumerable: true, get: function () { return create_1.createUserRoutes; } });
//# sourceMappingURL=index.js.map