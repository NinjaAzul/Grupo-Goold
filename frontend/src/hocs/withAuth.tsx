'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, DEFAULT_REDIRECT_ROUTES, DEFAULT_REDIRECT_PATH, LOGIN_ROUTES } from '@/constants';
import { Loading } from '@/@components/ui/Loading';

interface WithAuthOptions {
  redirectTo?: string;
  requireRole?: typeof ROLES[keyof typeof ROLES];
}

const LOGIN_ROUTES_ARRAY: string[] = Object.values(LOGIN_ROUTES) as string[];

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = DEFAULT_REDIRECT_PATH, requireRole } = options;

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user, token } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isLoginRoute = LOGIN_ROUTES_ARRAY.includes(pathname) || pathname === redirectTo;

    useEffect(() => {
      if (isLoginRoute) {
        return;
      }

      if (token && isLoading) {
        return;
      }

      if (token && !isAuthenticated) {
        return;
      }

      if (!token && !isLoading && !isAuthenticated) {
        router.replace(redirectTo);
        return;
      }

      if (!isLoading && isAuthenticated && requireRole && user?.roleId && user.roleId !== requireRole) {
        const redirectRoute = user.roleId === ROLES.ADMIN 
          ? DEFAULT_REDIRECT_ROUTES[ROLES.ADMIN]
          : DEFAULT_REDIRECT_ROUTES[ROLES.USER];
        router.replace(redirectRoute);
        return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isLoading, user, router, isLoginRoute, redirectTo, token, requireRole]);

    if (isLoginRoute) {
      return <Component {...props} />;
    }

    if (isLoading || (token && !isAuthenticated)) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loading size="lg" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requireRole && user?.roleId !== requireRole) {
      return null;
    }

    return <Component {...props} />;
  };
}

