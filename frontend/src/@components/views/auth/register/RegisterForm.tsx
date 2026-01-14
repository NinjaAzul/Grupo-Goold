'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { useRouter } from 'next/navigation';
import { Input } from '@/@components/ui/Input';
import { PasswordInput } from '@/@components/ui/PasswordInput';
import { Select } from '@/@components/ui/Select';
import { Button } from '@/@components/ui/Button';
import { Form } from '@/@components/ui/Form';
import { ChevronDownIcon, SpinnerIcon } from '@/@components/icons';
import { registerSchema, type RegisterFormData } from './schemas';
import { usePostUsers } from '@/api/generated/users/users';
import { useGetStates } from '@/api/generated/states/states';
import { useGetCities } from '@/api/generated/cities/cities';
import { AXIOS_INSTANCE } from '@/api/mutator';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const router = useRouter();
  const [cepData, setCepData] = useState<any>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      cityId: 0,
    },
  });

  const { data: statesData } = useGetStates();
  const { data: citiesData } = useGetCities(
    { stateId: selectedStateId! },
    { query: { enabled: !!selectedStateId } }
  );

  const { mutate: createUser, isPending: isCreatingUser } = usePostUsers({
    mutation: {
      onSuccess: () => {
        toast.success('Cadastro realizado com sucesso!');
        router.push('/auth/login');
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const watchedZipCode = form.watch('zipCode');

  // Buscar CEP quando completo (8 dígitos)
  useEffect(() => {
    const fetchCEP = async () => {
      if (!watchedZipCode) return;

      const cleanCEP = watchedZipCode.replace(/\D/g, '');
      if (cleanCEP.length !== 8) return;

      setIsSearchingCEP(true);
      try {
        const response = await AXIOS_INSTANCE.get(`/cities/search/cep/${cleanCEP}`);
        const data = response.data;

        setCepData(data);
        form.setValue('street', data.street || '');
        form.setValue('complement', data.complement || '');
        form.setValue('neighborhood', data.neighborhood || '');
        form.setValue('cityId', data.city.id);
        setSelectedStateId(data.state.id);
      } catch (err) {
        form.setError('zipCode', {
          message: 'CEP não encontrado',
        });
        setCepData(null);
      } finally {
        setIsSearchingCEP(false);
      }
    };

    const timeoutId = setTimeout(fetchCEP, 500); // Debounce de 500ms
    return () => clearTimeout(timeoutId);
  }, [watchedZipCode, form]);

  // Carregar cidades quando estado for selecionado ou quando CEP for encontrado
  useEffect(() => {
    if (cepData && cepData.state?.id) {
      setSelectedStateId(cepData.state.id);
      form.setValue('cityId', cepData.city.id);
    }
  }, [cepData, form]);

  const handleSubmit = (data: RegisterFormData) => {
    createUser({ data });
  };

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

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="min-w-0">
                <Input
                  {...field}
                  label="Nome (Obrigatório)"
                  placeholder="ex.: Jose"
                  error={fieldState.error?.message}
                  required
                />
              </div>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="min-w-0">
                <Input
                  {...field}
                  label="Sobrenome (Obrigatório)"
                  placeholder="ex.: Lima"
                  error={fieldState.error?.message}
                  required
                />
              </div>
            )}
          />
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="E-mail (Obrigatório)"
              placeholder="Insira seu e-mail"
              type="email"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              label="Senha de acesso (Obrigatório)"
              placeholder="Insira sua senha"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          name="zipCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <InputMask
              mask="99999-999"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSearchingCEP}
            >
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  label="CEP (Obrigatório)"
                  placeholder="Insira seu CEP"
                  error={fieldState.error?.message}
                  required
                  rightIcon={isSearchingCEP ? <SpinnerIcon className="w-5 h-5" /> : undefined}
                />
              )}
            </InputMask>
          )}
        />

        {cepData && (
          <>
            <Controller
              name="street"
              control={form.control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Endereço"
                  placeholder="Rua, Avenida, etc."
                  error={fieldState.error?.message}
                  disabled={!!cepData}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="min-w-0">
                    <Input
                      {...field}
                      label="Número"
                      placeholder="Número"
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />

              <Controller
                name="complement"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="min-w-0">
                    <Input
                      {...field}
                      label="Complemento"
                      placeholder="Complemento (opcional)"
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />
            </div>

            <Controller
              name="neighborhood"
              control={form.control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Bairro"
                  placeholder="Bairro"
                  error={fieldState.error?.message}
                  disabled={!!cepData}
                />
              )}
            />

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Estado <span className="text-error ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  value={selectedStateId || ''}
                  onChange={(e) => {
                    const stateId = Number(e.target.value);
                    setSelectedStateId(stateId);
                    form.setValue('cityId', 0); // Reset cidade quando mudar estado
                  }}
                  disabled={!!cepData}
                >
                  <option value="" disabled>
                    Selecione o estado
                  </option>
                  {statesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            {selectedStateId && (
              <Controller
                name="cityId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    label="Cidade"
                    placeholder="Selecione a cidade"
                    options={citiesOptions}
                    error={fieldState.error?.message}
                    required
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                )}
              />
            )}
          </>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isCreatingUser}
          disabled={
            !form.watch('firstName') ||
            !form.watch('lastName') ||
            !form.watch('email') ||
            !form.watch('password') ||
            !form.watch('zipCode') ||
            (cepData && !form.watch('cityId')) ||
            !!form.formState.errors.email ||
            !!form.formState.errors.password
          }
          className="w-full"
        >
          Cadastrar-se
        </Button>
      </div>
    </Form>
  );
}
