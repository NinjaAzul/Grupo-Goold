'use client';

import { useEffect, useMemo } from 'react';
import { usePage } from '@/contexts/PageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AccountForm } from './AccountForm';
import { type AccountFormData } from './schemas';
import type { GetUsersProfile200User } from '@/api/generated/models';

export function AccountView() {
  const { setPageInfo } = usePage();
  const { user } = useAuth();

  useEffect(() => {
    setPageInfo(
      'Minha conta',
      'Ajuste informações da sua conta de forma simples'
    );
  }, [setPageInfo]);

  const defaultValues = useMemo<Partial<AccountFormData>>(() => {
    if (!user) return {};
    
    const userWithAddress = user as GetUsersProfile200User & {
      zipCode?: string;
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      cityId?: number;
      city?: {
        stateId?: number;
      };
    };
    
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      zipCode: userWithAddress.zipCode || '',
      street: userWithAddress.street || '',
      number: userWithAddress.number || '',
      complement: userWithAddress.complement ?? '',
      neighborhood: userWithAddress.neighborhood || '',
      stateId: userWithAddress.city?.stateId,
      cityId: userWithAddress.cityId || 0,
    };
  }, [user]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[470px]">
        <AccountForm defaultValues={defaultValues} />
      </div>
    </div>
  );
}

