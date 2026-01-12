'use client';

import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { usePostUsers } from '@/api/generated/users/users';
import { LoginHeader } from '@/components/views/admin/auth/login/LoginHeader';
import { RegisterForm } from './RegisterForm';
import { type RegisterFormData } from './types';
import toast from 'react-hot-toast';

export function RegisterView() {
  const router = useRouter();

  const { mutate: createUser, isPending, error } = usePostUsers({
    mutation: {
      onSuccess: () => {
        toast.success('Cadastro realizado com sucesso!');
        router.push('/user/login');
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.error?.message ||
          'Erro ao criar conta. Tente novamente.';
        toast.error(message);
      },
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    createUser({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        zipCode: data.zipCode,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        cityId: data.cityId,
      },
    });
  };

  const getErrorMessage = (): string | undefined => {
    if (error && 'response' in error) {
      const axiosError = error as any;
      return (
        axiosError?.response?.data?.error?.message ||
        'Erro ao criar conta. Verifique os dados e tente novamente.'
      );
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <LoginHeader title="Cadastre-se" showRegisterButton={false} />
        <RegisterForm
          onSubmit={onSubmit}
          isLoading={isPending}
          error={getErrorMessage()}
        />
      </div>
    </div>
  );
}

