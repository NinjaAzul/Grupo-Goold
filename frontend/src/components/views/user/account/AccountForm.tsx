'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { accountSchema, type AccountFormData } from './types';
import { SpinnerIcon } from '@/components/icons';
import { AXIOS_INSTANCE } from '@/api/mutator';

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => void;
  isLoading?: boolean;
  error?: string;
  defaultValues?: Partial<AccountFormData>;
}

export function AccountForm({
  onSubmit,
  isLoading = false,
  error,
  defaultValues,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues,
  });

  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const zipCode = watch('zipCode');

  // Buscar CEP quando completo (8 dígitos)
  useEffect(() => {
    const fetchCEP = async () => {
      if (!zipCode) return;

      const cleanCEP = zipCode.replace(/\D/g, '');
      if (cleanCEP.length !== 8) return;

      setIsLoadingCEP(true);
      try {
        const response = await AXIOS_INSTANCE.get(
          `/cities/search/cep/${cleanCEP}`
        );

        const data = response.data;
        setValue('street', data.street || '');
        setValue('complement', data.complement || '');
        setValue('neighborhood', data.neighborhood || '');
        setValue('cityId', data.city.id, { shouldValidate: true });
      } catch (err) {
        setError('zipCode', {
          message: 'CEP não encontrado',
        });
      } finally {
        setIsLoadingCEP(false);
      }
    };

    const timeoutId = setTimeout(fetchCEP, 500); // Debounce de 500ms
    return () => clearTimeout(timeoutId);
  }, [zipCode, setValue, setError]);

  useEffect(() => {
    if (error && !errors.root) {
      setError('root', { message: error });
    }
  }, [error, setError, errors.root]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome (Obrigatório)"
          {...register('firstName')}
          error={errors.firstName?.message}
          required
          disabled={isLoading}
          placeholder="ex.: Jose"
        />
        <Input
          label="Sobrenome (Obrigatório)"
          {...register('lastName')}
          error={errors.lastName?.message}
          required
          disabled={isLoading}
          placeholder="ex: Lima"
        />
      </div>

      <Input
        label="E-mail (Obrigatório)"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
        disabled={true}
        placeholder="Insira seu e-mail"
      />

      <PasswordInput
        label="Senha de acesso (Opcional - deixe em branco para não alterar)"
        {...register('password')}
        error={errors.password?.message}
        disabled={isLoading}
        placeholder="Insira sua senha"
      />

      <div className="relative">
        <label className="block text-sm font-medium text-primary mb-2">
          CEP (Obrigatório)
          <span className="text-error ml-1">*</span>
        </label>
        <div className="relative">
          <InputMask
            mask="99999-999"
            value={zipCode || ''}
            onChange={(e) => setValue('zipCode', e.target.value)}
            disabled={isLoading}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.zipCode ? 'border-error' : 'border-gray-300'
                }`}
                placeholder="Insira seu CEP"
              />
            )}
          </InputMask>
          {isLoadingCEP && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <SpinnerIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        {errors.zipCode && (
          <p className="mt-1 text-sm text-error">{errors.zipCode.message}</p>
        )}
      </div>

      <Input
        label="Endereço"
        {...register('street')}
        error={errors.street?.message}
        required
        disabled={isLoading || isLoadingCEP}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Número"
          {...register('number')}
          error={errors.number?.message}
          required
          disabled={isLoading || isLoadingCEP}
        />
        <Input
          label="Complemento"
          {...register('complement')}
          error={errors.complement?.message}
          disabled={isLoading || isLoadingCEP}
        />
      </div>

      <Input
        label="Bairro"
        {...register('neighborhood')}
        error={errors.neighborhood?.message}
        required
        disabled={isLoading || isLoadingCEP}
      />

      <Input
        label="Cidade"
        disabled
        value={watch('cityId') ? 'Preenchido automaticamente' : ''}
      />

      <input
        type="hidden"
        {...register('cityId', { valueAsNumber: true })}
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
        Salvar
      </Button>
    </form>
  );
}

