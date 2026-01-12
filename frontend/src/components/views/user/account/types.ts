import { z } from 'zod';

export const accountSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().optional(),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  street: z.string().min(1, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  cityId: z.number().min(1, 'Cidade é obrigatória'),
});

export type AccountFormData = z.infer<typeof accountSchema>;

