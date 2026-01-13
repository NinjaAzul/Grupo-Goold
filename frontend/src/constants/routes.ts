import { ROLES } from './roles';

export const LOGIN_ROUTES = {
  [ROLES.ADMIN]: '/admin/login',
  [ROLES.USER]: '/auth/login',
} as const;

export const DEFAULT_REDIRECT_ROUTES = {
  [ROLES.ADMIN]: '/admin/appointments',
  [ROLES.USER]: '/user/appointments',
} as const;

export const DEFAULT_REDIRECT_PATH = '/auth/login';

