'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { Input } from '@/@components/ui/Input';
import { PasswordInput } from '@/@components/ui/PasswordInput';
import { Select } from '@/@components/ui/Select';
import { Button } from '@/@components/ui/Button';
import { Form } from '@/@components/ui/Form';
import { accountSchema, type AccountFormData } from './schemas';
import { getCitiesSearchCepCep, useGetCities } from '@/api/generated/cities/cities';
import { useGetStates } from '@/api/generated/states/states';
import { useDebounce } from '@/hooks/useDebounce';
import { usePatchUsersProfile, getGetUsersProfileQueryKey } from '@/api/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const REMOVE_NON_DIGITS_REGEX = /\D/g;

interface AccountFormProps {
  defaultValues?: Partial<AccountFormData>;
}

export function AccountForm({
  defaultValues,
}: AccountFormProps) {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const updateProfile = usePatchUsersProfile({
    mutation: {
      onSuccess: async () => {
        toast.success('Dados atualizados com sucesso!');
        await queryClient.invalidateQueries({
          queryKey: getGetUsersProfileQueryKey(),
        });
        refreshUser();
      },
      onError: (error: unknown) => {
        const message =
          (error as { response?: { data?: { error?: { message?: string } } } })
            ?.response?.data?.error?.message || 'Erro ao atualizar dados';
        toast.error(message);
      },
    },
  }, queryClient);

  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const watchedZipCode = form.watch('zipCode');
  const watchedStateId = form.watch('stateId');
  const debouncedZipCode = useDebounce(watchedZipCode, 500);

  const { data: statesData } = useGetStates();
  const { data: citiesData } = useGetCities(
    { stateId: watchedStateId! },
    { query: { enabled: !!watchedStateId } }
  );

  const statesOptions: Array<{ value: string | number; label: string }> =
    statesData?.states
      ?.filter((state) => state.id !== undefined)
      .map((state) => ({
        value: state.id!,
        label: state.name || '',
      })) || [];

  const citiesOptions: Array<{ value: string | number; label: string }> =
    citiesData?.cities
      ?.filter((city) => city.id !== undefined)
      .map((city) => ({
        value: city.id!,
        label: city.name || '',
      })) || [];

  useEffect(() => {
    const fetchCEP = async () => {
      if (!debouncedZipCode) {
        form.setValue('cityId', 0);
        form.setValue('stateId', undefined);
        form.setValue('street', '');
        form.setValue('neighborhood', '');
        return;
      }

      const cleanCEP = debouncedZipCode.replace(REMOVE_NON_DIGITS_REGEX, '');
      if (cleanCEP.length !== 8) return;

      setIsSearchingCEP(true);
      try {
        const data = await getCitiesSearchCepCep(cleanCEP);

        if (!data.city || !data.state || !data.city.id || !data.state.id) {
          throw new Error('CEP não encontrado');
        }

        form.setValue('street', data.street || '');
        if (data.complement) {
          form.setValue('complement', data.complement);
        }
        form.setValue('neighborhood', data.neighborhood || '');
        form.setValue('cityId', data.city.id);
        form.setValue('stateId', data.state.id);
      } catch (err) {
        form.setError('zipCode', {
          message: 'CEP não encontrado',
        });
        form.setValue('cityId', 0);
        form.setValue('stateId', undefined);
        form.setValue('street', '');
        form.setValue('neighborhood', '');
      } finally {
        setIsSearchingCEP(false);
      }
    };

    fetchCEP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedZipCode]);

  const onSubmit = (data: AccountFormData) => {
    const updateData: {
      firstName: string;
      lastName: string;
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      cityId: number;
      password?: string;
    } = {
      firstName: data.firstName,
      lastName: data.lastName,
      zipCode: data.zipCode,
      street: data.street,
      number: data.number,
      complement: data.complement === '' ? undefined : data.complement,
      neighborhood: data.neighborhood,
      cityId: data.cityId,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.password = data.password;
    }

    updateProfile.mutate({ data: updateData });
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="p-0">
      <div className="space-y-[10px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <Input
                label="Nome (Obrigatório)"
                {...field}
                error={form.formState.errors.firstName?.message}
                required
                disabled={updateProfile.isPending}
                placeholder="ex.: Jose"
              />
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <Input
                label="Sobrenome (Obrigatório)"
                {...field}
                error={form.formState.errors.lastName?.message}
                required
                disabled={updateProfile.isPending}
                placeholder="ex: Lima"
              />
            )}
          />
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Input
              label="E-mail (Obrigatório)"
              type="email"
              {...field}
              error={form.formState.errors.email?.message}
              required
              disabled={true}
              placeholder="Insira seu e-mail"
            />
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <PasswordInput
              label="Senha de acesso (Opcional - deixe em branco para não alterar)"
              {...field}
              error={form.formState.errors.password?.message}
              disabled={updateProfile.isPending}
              placeholder="Insira sua senha"
            />
          )}
        />

        <Controller
          name="zipCode"
          control={form.control}
          render={({ field }) => (
            <div className="relative">
              <InputMask
                mask="99999-999"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={updateProfile.isPending}
              >
                {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                  <Input
                    {...inputProps}
                    label="CEP (Obrigatório)"
                    error={form.formState.errors.zipCode?.message}
                    required
                    placeholder="Insira seu CEP"
                    isLoading={isSearchingCEP}
                  />
                )}
              </InputMask>
            </div>
          )}
        />

        <Controller
          name="street"
          control={form.control}
          render={({ field }) => (
            <Input
              label="Endereço"
              {...field}
              error={form.formState.errors.street?.message}
              required
              disabled={updateProfile.isPending || isSearchingCEP}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="number"
            control={form.control}
            render={({ field }) => (
              <Input
                label="Número"
                {...field}
                error={form.formState.errors.number?.message}
                required
                disabled={updateProfile.isPending || isSearchingCEP}
              />
            )}
          />
          <Controller
            name="complement"
            control={form.control}
            render={({ field }) => (
              <Input
                label="Complemento"
                {...field}
                error={form.formState.errors.complement?.message}
                disabled={updateProfile.isPending || isSearchingCEP}
              />
            )}
          />
        </div>

        <Controller
          name="neighborhood"
          control={form.control}
          render={({ field }) => (
            <Input
              label="Bairro"
              {...field}
              error={form.formState.errors.neighborhood?.message}
              required
              disabled={updateProfile.isPending || isSearchingCEP}
            />
          )}
        />

        <Controller
          name="stateId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Select
              label="Estado"
              placeholder="Selecione o estado"
              options={statesOptions}
              error={fieldState.error?.message}
              required
              value={field.value || ''}
              onChange={(value) => {
                const stateId = value ? Number(value) : undefined;
                field.onChange(stateId);
                form.setValue('cityId', 0);
              }}
              disabled={updateProfile.isPending || isSearchingCEP}
            />
          )}
        />

        {watchedStateId && (
          <Controller
            name="cityId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Select
                label="Cidade"
                placeholder="Selecione a cidade"
                options={citiesOptions}
                error={fieldState.error?.message}
                required
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                disabled={updateProfile.isPending || isSearchingCEP}
              />
            )}
          />
        )}

        {form.formState.errors.root && (
          <div className="p-3 rounded-lg bg-error-light border border-error">
            <p className="text-sm text-error">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={updateProfile.isPending}
          className="w-full"
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}

