'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/@components/ui/Input';
import { PasswordInput } from '@/@components/ui/PasswordInput';
import { Button } from '@/@components/ui/Button';
import { Form } from '@/@components/ui/Form';
import { emailSchema, loginSchema, type EmailFormData, type LoginFormData } from './schemas';
import { usePostUsersCheckEmail, usePostUsersLogin } from '@/api/generated/users/users';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface LoginFormProps {
  defaultValues?: Partial<LoginFormData>;
  error?: string;
}

enum LoginStep {
  EMAIL = 'check-email',
  PASSWORD = 'authorization',
}

const STEP_ORDER: LoginStep[] = [LoginStep.EMAIL, LoginStep.PASSWORD];

const STEP_CONFIG = {
  [LoginStep.EMAIL]: {
    title: 'E-mail',
    canGoBack: false,
  },
  [LoginStep.PASSWORD]: {
    title: 'Senha',
    canGoBack: true,
  },
} as const;

export function LoginForm({
  defaultValues,
}: LoginFormProps) {
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.EMAIL);
  const [email, setEmail] = useState<string>(defaultValues?.email || '');
  const { login: setAuthToken } = useAuth();

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

  const watchedEmail = emailForm.watch('email');

  const { mutate: checkEmail, isPending: isCheckingEmail } = usePostUsersCheckEmail({
    mutation: {
      onSuccess: (response, variables) => {
        if (response.exists) {
          const verifiedEmail = variables.data.email;
          setEmail(verifiedEmail);
          loginForm.setValue('email', verifiedEmail);
          goToNextStep();
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

  const { mutate: login, isPending: isLoggingIn } = usePostUsersLogin({
    mutation: {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
          toast.success('Login realizado com sucesso!');
        }
      },
      onError: (error: AxiosError<{ error?: { message?: string } }>) => {
        console.error(error);

        if (error.response?.data?.error?.message) {
          toast.error(error.response.data.error.message);
        }
      },
    },
  });

  useEffect(() => {
    if (email) {
      loginForm.setValue('email', email);
    }
  }, [email, loginForm]);


  const goToNextStep = () => {
    setCurrentStep((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev);
      const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1);
      return STEP_ORDER[nextIndex];
    });
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev);
      const previousIndex = Math.max(currentIndex - 1, 0);
      const newStep = STEP_ORDER[previousIndex];
      
      if (newStep === LoginStep.EMAIL) {
        loginForm.setValue('email', '');
        setEmail('');
      }
      
      return newStep;
    });
  };

  const handleCheckEmail = (data: EmailFormData) => {
    checkEmail({ data: { email: data.email } });
  };

  const handleLogin = (data: LoginFormData) => {
    login({ data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case LoginStep.EMAIL:
        return (
          <Form onSubmit={emailForm.handleSubmit(handleCheckEmail)}>
            <div className="space-y-6">
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="E-mail (Obrigatório)"
                    placeholder="Insira seu e-mail"
                    type="email"
                    error={fieldState.error?.message}
                    required
                    disabled={isCheckingEmail}
                  />
                )}
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
                disabled={!watchedEmail || !!emailForm.formState.errors.email}
                className="w-full"
              >
                Acessar conta
              </Button>

              <div className="text-center flex items-center justify-between">
                <span className="text-sm font-normal text-primary leading-5">
                  Ainda não tem um cadastro?
                </span>
                <a
                  href="/auth/register"
                  className="text-sm font-bold text-primary leading-5 underline pr-4"
                >
                  Cadastre-se
                </a>
              </div>
            </div>
          </Form>
        );

      case LoginStep.PASSWORD:
        return (
          <Form onSubmit={loginForm.handleSubmit(handleLogin)}>
            <div className="space-y-6">
              <Controller
                name="email"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="E-mail (Obrigatório)"
                    placeholder="Insira seu e-mail"
                    type="email"
                    error={fieldState.error?.message}
                    required
                    disabled={isLoggingIn}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmail(e.target.value);
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <PasswordInput
                    {...field}
                    label="Senha de acesso (Obrigatório)"
                    placeholder="Insira sua senha"
                    error={fieldState.error?.message}
                    required
                    disabled={isLoggingIn}
                    autoFocus
                  />
                )}
              />

              <div className="flex gap-3">
                {STEP_CONFIG[currentStep].canGoBack && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={goToPreviousStep}
                    disabled={isLoggingIn}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoggingIn}
                  className="flex-1"
                >
                  Entrar
                </Button>
              </div>

              <div className="text-center">
                <span className="text-sm font-normal text-primary leading-5">
                  Ainda não tem um cadastro?{' '}
                </span>
                <a
                  href="/auth/register"
                  className="text-sm font-bold text-primary leading-5 underline"
                >
                  Cadastre-se
                </a>
              </div>
            </div>
          </Form>
        );

      default:
        return null;
    }
  };

  return renderStep();
}

