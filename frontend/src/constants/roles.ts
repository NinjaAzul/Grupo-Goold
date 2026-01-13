export const ROLES = {
  ADMIN: 1,
  USER: 2,
} as const;

export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.USER]: 'Usuário',
} as const;

export type RoleId = typeof ROLES[keyof typeof ROLES];