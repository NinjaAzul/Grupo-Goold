'use client';

import { withAuth } from './withAuth';
import { ROLES, LOGIN_ROUTES } from '@/constants';

export function withUserAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuth(Component, {
    redirectTo: LOGIN_ROUTES[ROLES.USER],
    requireRole: ROLES.USER,
  });
}

