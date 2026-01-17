'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/@components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { ROLES, DEFAULT_REDIRECT_ROUTES } from '@/constants';

export function LoginView() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.roleId) {

      const roleId = Number(user.roleId);
      const redirectRoute = roleId === ROLES.ADMIN 
        ? DEFAULT_REDIRECT_ROUTES[ROLES.ADMIN]
        : DEFAULT_REDIRECT_ROUTES[ROLES.USER];
      
      router.replace(redirectRoute);
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        Entre na sua conta
      </h1>
      <LoginForm />
    </div>
  );
}

