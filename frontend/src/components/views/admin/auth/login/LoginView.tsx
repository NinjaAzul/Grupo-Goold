'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { type LoginFormData } from './types';

interface LoginViewProps {
  title?: string;
  redirectTo?: string;
  defaultRedirect?: string;
}

export function LoginView({
  title = 'Login',
  redirectTo,
  defaultRedirect = '/admin/agendamentos',
}: LoginViewProps) {
  const router = useRouter();
  const { login: setAuthToken, isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Se tiver redirectTo, usa ele, senão usa defaultRedirect
      const redirect = redirectTo || defaultRedirect;
      router.replace(redirect);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, defaultRedirect]);

  const { mutate: login, isPending, error } = usePostUsersLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
        }
        const redirect = redirectTo || defaultRedirect;
        router.replace(redirect);
      },
      onError: () => {
        // Error handling is done in the form component via error prop
      },
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login({ data });
  };

  const getErrorMessage = (): string | undefined => {
    if (error && 'message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if (error) {
      return 'Credenciais inválidas. Verifique seu e-mail e senha.';
    }
    return undefined;
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <LoginHeader title={title} />
        <LoginForm
          onSubmit={onSubmit}
          isLoading={isPending}
          error={getErrorMessage()}
        />
      </div>
    </div>
  );
}

