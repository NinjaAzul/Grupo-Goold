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
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isLoginRoute = LOGIN_ROUTES_ARRAY.includes(pathname) || pathname === redirectTo;

    useEffect(() => {
      if (isLoginRoute) {
        return;
      }

      if (!isLoading && !isAuthenticated) {
        router.replace(redirectTo);
      }

      if (!isLoading && isAuthenticated && requireRole && user?.roleId) {
        const isAdmin = user.roleId === ROLES.ADMIN;
        const isUser = user.roleId === ROLES.USER;

        if (isAdmin) {
          router.replace(DEFAULT_REDIRECT_ROUTES[ROLES.ADMIN]);
        } else if (isUser) {
          router.replace(DEFAULT_REDIRECT_ROUTES[ROLES.USER]);
        }
      }
    }, [isAuthenticated, isLoading, user, router, isLoginRoute]);

    if (isLoginRoute) {
      return <Component {...props} />;
    }

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loading size="lg" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

