'use client';

import { ROLES, LOGIN_ROUTES } from '@/constants';
import { withAuth } from './withAuth';

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuth(Component, {
    redirectTo: LOGIN_ROUTES[ROLES.ADMIN],
    requireRole: ROLES.ADMIN,
  });
}

