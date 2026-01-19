import { NODE_ENV_ENUM } from '@shared/environments/env.validation';

process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1d';
process.env.NODE_ENV = NODE_ENV_ENUM.TEST;
