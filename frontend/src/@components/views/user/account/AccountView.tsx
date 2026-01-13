'use client';

import { useEffect, useState } from 'react';
import { usePage } from '@/contexts/PageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AccountForm } from './AccountForm';
import { type AccountFormData } from './types';
import { AXIOS_INSTANCE } from '@/api/mutator';
import toast from 'react-hot-toast';

export function AccountView() {
  const { setPageInfo } = usePage();
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<AccountFormData> | undefined>();

  useEffect(() => {
    setPageInfo(
      'Minha conta',
      'Ajuste informações da sua conta de forma simples'
    );
  }, [setPageInfo]);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setDefaultValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        zipCode: user.zipCode || '',
        street: user.street || '',
        number: user.number || '',
        complement: user.complement || '',
        neighborhood: user.neighborhood || '',
        cityId: user.cityId || 0,
      });
    }
  }, [user]);

  const onSubmit = async (data: AccountFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        zipCode: data.zipCode,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        cityId: data.cityId,
      };

      // Só atualizar senha se foi informada
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      await AXIOS_INSTANCE.patch(`/users/${user.id}`, updateData);
      toast.success('Dados atualizados com sucesso!');
      await refreshUser();
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        'Erro ao atualizar dados';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!defaultValues) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-background-white rounded-[5px] border border-border p-4 lg:p-8">
      <AccountForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={defaultValues}
      />
    </div>
  );
}

