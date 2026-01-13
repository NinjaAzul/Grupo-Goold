'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/@components/ui/Loading';
import { usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { type LoginFormData } from './schemas';
import { ROLES, DEFAULT_REDIRECT_ROUTES } from '@/constants';
import toast from 'react-hot-toast';



export function LoginView() {
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

  const { mutate: login, isPending } = usePostUsersLogin({
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
    <div className="w-full max-w-md">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        Entre na sua conta
      </h1>
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isPending}
      />
    </div>
  );
}

