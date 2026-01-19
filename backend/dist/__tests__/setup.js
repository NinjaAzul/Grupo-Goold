"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_validation_1 = require("@shared/environments/env.validation");
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1d';
process.env.NODE_ENV = env_validation_1.NODE_ENV_ENUM.TEST;
//# sourceMappingURL=setup.js.map