/**
 * Permission constants for the system
 */
export const PERMISSIONS = {
  APPOINTMENTS: 'APPOINTMENTS',
  LOGS: 'LOGS',
  ROOMS: 'ROOMS',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
