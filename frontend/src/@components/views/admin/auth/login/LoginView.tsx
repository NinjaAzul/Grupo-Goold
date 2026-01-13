'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/@components/ui/Loading';
import { usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { type LoginFormData } from './types';
import { ROLES, DEFAULT_REDIRECT_ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';
import { LogoIcon } from '@/@components/icons';

interface LoginViewProps {
  title?: string;
  redirectTo?: string;
  defaultRedirect?: string;
}

export function LoginView({
}: LoginViewProps) {
  const router = useRouter();
  const { login: setAuthToken, isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {

      const roleId = user.roleId;
      if (roleId === ROLES.ADMIN) {
        router.replace(DEFAULT_REDIRECT_ROUTES[ROLES.ADMIN]);
      } else {
        router.replace(DEFAULT_REDIRECT_ROUTES[ROLES.USER]);

      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  const { mutate: login, isPending, error } = usePostUsersLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
          toast.success('Login realizado com sucesso!');
        }
      },
      onError: () => {
        toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
      },
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login({ data });
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
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
          <LogoIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        Login Admin
      </h1>
        <LoginForm
          onSubmit={onSubmit}
          isLoading={isPending}
          error={error?.message}
        />
      </div>
    </div>
  );
}

