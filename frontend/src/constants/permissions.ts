export const PERMISSIONS = {
  LOGS: 'LOGS',
  APPOINTMENTS: 'APPOINTMENTS',
  ROOMS: 'ROOMS',
} as const;

export const PERMISSION_IDS = {
  APPOINTMENTS: 1,
  LOGS: 2,
  ROOMS: 3,
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

