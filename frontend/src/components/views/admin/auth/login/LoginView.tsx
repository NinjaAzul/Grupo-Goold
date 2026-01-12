'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { type LoginFormData } from './types';
import { ROLES, ROLE_DEFAULT_REDIRECTS } from '@/constants/roles';

interface LoginViewProps {
  title?: string;
  redirectTo?: string;
  defaultRedirect?: string;
}

export function LoginView({
  title = 'Login',
  redirectTo,
  defaultRedirect,
}: LoginViewProps) {
  const router = useRouter();
  const { login: setAuthToken, isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Se tiver redirectTo, usa ele
      if (redirectTo) {
        router.replace(redirectTo);
        return;
      }

      // Senão, redireciona baseado no perfil do usuário
      const roleId = user.roleId;
      if (roleId === ROLES.ADMIN) {
        router.replace(ROLE_DEFAULT_REDIRECTS[ROLES.ADMIN]);
      } else if (roleId === ROLES.USER) {
        router.replace(ROLE_DEFAULT_REDIRECTS[ROLES.USER]);
      } else {
        // Fallback para defaultRedirect se fornecido, senão usa admin
        router.replace(defaultRedirect || ROLE_DEFAULT_REDIRECTS[ROLES.ADMIN]);
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo, defaultRedirect, user]);

  const { mutate: login, isPending, error } = usePostUsersLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
          // Não redirecionar aqui - deixar o useEffect fazer o redirecionamento
          // quando isAuthenticated for true (após o profile carregar)
        }
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

  const isUserLogin = defaultRedirect?.startsWith('/user') || redirectTo?.startsWith('/user');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <LoginHeader title={title} showRegisterButton={isUserLogin} />
        <LoginForm
          onSubmit={onSubmit}
          isLoading={isPending}
          error={getErrorMessage()}
        />
      </div>
    </div>
  );
}

