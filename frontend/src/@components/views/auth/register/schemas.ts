import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  street: z.string().min(1, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  stateId: z.number().optional(),
  cityId: z.number().min(1, 'Cidade é obrigatória'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

