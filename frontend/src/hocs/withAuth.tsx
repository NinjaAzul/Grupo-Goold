'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/roles';
import { Loading } from '@/components/ui/Loading';

interface WithAuthOptions {
  redirectTo?: string;
  requireRole?: 'admin' | 'user';
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requireRole } = options;

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    
    // Permitir acesso à rota de login sem autenticação
    const isLoginRoute = pathname === '/login' || pathname === redirectTo;

    useEffect(() => {
      // Não redirecionar se estiver na rota de login
      if (isLoginRoute) {
        return;
      }
      
      if (!isLoading && !isAuthenticated) {
        router.replace(redirectTo);
      }
      
      if (
        !isLoading &&
        isAuthenticated &&
        requireRole &&
        user?.roleId !== undefined
      ) {
        
        const isAdmin = user.roleId === ROLES.ADMIN;
        const isUser = user.roleId === ROLES.USER;

        if (requireRole === 'admin' && !isAdmin) {
          router.replace('/admin/agendamentos');
        } else if (requireRole === 'user' && !isUser) {
          router.replace('/admin/agendamentos');
        }
      }
    }, [isAuthenticated, isLoading, user, router, isLoginRoute]);

    // Se for a rota de login, sempre renderizar
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

