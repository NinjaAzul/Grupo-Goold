'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from './types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<LoginFormData>;
  error?: string;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  error,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultValues || {
      email: 'admin@example.com',
      password: '12345678',
    },
  });

  // Set root error if provided
  useEffect(() => {
    if (error && !errors.root) {
      setError('root', { message: error });
    }
  }, [error, setError, errors.root]);

  return (
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
          disabled={isLoading}
        />

        <PasswordInput
          label="Senha de acesso (Obrigatório)"
          {...register('password')}
          error={errors.password?.message}
          required
          disabled={isLoading}
        />

        {(errors.root || error) && (
          <div className="p-3 rounded-lg bg-error-light border border-error">
            <p className="text-sm text-error">
              {errors.root?.message || error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          Acessar conta
        </Button>
      </div>
    </form>
  );
}

