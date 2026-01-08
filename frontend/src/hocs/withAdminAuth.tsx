'use client';

import { withAuth } from './withAuth';

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuth(Component, {
    redirectTo: '/admin/login',
    requireRole: 'admin',
  });
}

