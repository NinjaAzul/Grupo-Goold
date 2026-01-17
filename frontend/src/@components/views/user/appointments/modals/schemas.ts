import { z } from 'zod';

export const newAppointmentSchema = z.object({
  date: z.date({ message: 'Data é obrigatória' }),
  time: z.string().min(1, 'Horário é obrigatório'),
  roomId: z.number().min(1, 'Sala é obrigatória'),
});

export type NewAppointmentFormData = z.infer<typeof newAppointmentSchema>;

