'use client';

import { withAuth } from './withAuth';

export function withUserAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuth(Component, {
    redirectTo: '/user/login',
    requireRole: 'user',
  });
}

