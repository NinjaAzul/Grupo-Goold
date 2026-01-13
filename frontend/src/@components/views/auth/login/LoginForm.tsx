'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/@components/ui/Input';
import { PasswordInput } from '@/@components/ui/PasswordInput';
import { Button } from '@/@components/ui/Button';
import { emailSchema, loginSchema, type EmailFormData, type LoginFormData } from './schemas';
import { usePostUsersCheckEmail } from '@/api/generated/users/users';

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
}: LoginFormProps) {
  const [phase, setPhase] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState<string>(defaultValues?.email || '');

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: defaultValues?.email || '',
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultValues || {
      email: email || '',
      password: '',
    },
  });

  const { mutate: checkEmail, isPending: isCheckingEmail } = usePostUsersCheckEmail({
    mutation: {
      onSuccess: (response, variables) => {
        if (response.exists) {
          const verifiedEmail = variables.data.email;
          setEmail(verifiedEmail);
          setPhase('password');
          loginForm.setValue('email', verifiedEmail);
        } else {
          emailForm.setError('email', {
            message: 'E-mail não encontrado. Verifique o e-mail digitado.',
          });
        }
      },
      onError: () => {
        emailForm.setError('root', {
          message: 'Erro ao verificar e-mail. Tente novamente.',
        });
      },
    },
  });

  useEffect(() => {
    if (email) {
      loginForm.setValue('email', email);
    }
  }, [email, loginForm]);

  const handleCheckEmail = (data: EmailFormData) => {
    checkEmail({ data: { email: data.email } });
  };

  const handleLogin = (data: LoginFormData) => {
    onSubmit(data);
  };

  if (phase === 'email') {
    return (
      <form
        onSubmit={emailForm.handleSubmit(handleCheckEmail)}
        className="bg-background-white p-6 sm:p-8 rounded-lg border border-border"
      >
        <div className="space-y-6">
          <Input
            label="E-mail (Obrigatório)"
            placeholder="Insira seu e-mail"
            type="email"
            {...emailForm.register('email')}
            error={emailForm.formState.errors.email?.message}
            required
            disabled={isCheckingEmail}
          />

          {emailForm.formState.errors.root && (
            <div className="p-3 rounded-lg bg-error-light border border-error">
              <p className="text-sm text-error">
                {emailForm.formState.errors.root.message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isCheckingEmail}
            className="w-full"
          >
            Acessar conta
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={loginForm.handleSubmit(handleLogin)}
      className="bg-background-white p-6 sm:p-8 rounded-lg border border-border"
    >
      <div className="space-y-6">
        <Input
          label="E-mail (Obrigatório)"
          placeholder="Insira seu e-mail"
          type="email"
          {...loginForm.register('email')}
          error={loginForm.formState.errors.email?.message}
          required
          disabled={true}
        />

        <PasswordInput
          label="Senha de acesso (Obrigatório)"
          placeholder="Insira sua senha"
          {...loginForm.register('password')}
          error={loginForm.formState.errors.password?.message}
          required
          disabled={isLoading}
          autoFocus
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
          >
            Entrar
          </Button>
        </div>
      </div>
    </form>
  );
}

