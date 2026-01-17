'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants';
import { Loading } from '@/@components/ui/Loading';

interface WithPermissionOptions {
  permission: string;
  fallback?: React.ReactNode;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options: WithPermissionOptions
) {
  const { permission, fallback } = options;

  return function PermissionProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();

    const hasPermission = useMemo(() => {
      if (user?.roleId === ROLES.ADMIN) {
        return true;
      }
      if (!user) return false;

      const userWithPermissions = user as typeof user & {
        permissions?: Array<{
          permission: { name: string };
          granted: boolean;
        }>;
      };

      if (!userWithPermissions.permissions) return false;

      const userPermission = userWithPermissions.permissions.find(
        (p) => p.permission.name === permission
      );

      return userPermission?.granted === true;
    }, [user]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loading size="lg" />
        </div>
      );
    }

    if (!hasPermission) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="bg-background-white rounded-[5px] border border-border p-8 text-center">
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

