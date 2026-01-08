'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { LogoIcon } from '@/components/icons';
import { Loading } from '@/components/ui/Loading';
import { usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login: setAuthToken, isAuthenticated, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: '12345678',
    },
  });

 
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/agendamentos');
    }
  }, [isAuthenticated, isLoading, router]);

  const { mutate: login, isPending } = usePostUsersLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
        }

     
        router.replace('/admin/agendamentos');
      },
      onError: (error) => {
        // Tratar erro de autenticação
        if ('message' in error && typeof error.message === 'string') {
          setError('root', {
            message: error.message,
          });
        } else {
          setError('root', {
            message: 'Credenciais inválidas. Verifique seu e-mail e senha.',
          });
        }
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-background-white p-6 sm:p-8 rounded-lg shadow-lg"
        >
          <div className="space-y-6">
            <Input
              label="E-mail (Obrigatório)"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
              disabled={isPending}
            />

            <PasswordInput
              label="Senha de acesso (Obrigatório)"
              {...register('password')}
              error={errors.password?.message}
              required
              disabled={isPending}
            />

            {errors.root && (
              <div className="p-3 rounded-lg bg-error-light border border-error">
                <p className="text-sm text-error">{errors.root.message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isPending}
              className="w-full"
            >
              Acessar conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

