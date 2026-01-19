import { z } from 'zod';

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const newAppointmentSchema = z.object({
  date: z.date({ message: 'Data é obrigatória' }),
  time: z
    .string()
    .min(1, 'Horário é obrigatório')
    .regex(timeRegex, 'Horário deve estar no formato HH:mm (ex: 14:30)'),
  roomId: z.number().min(1, 'Sala é obrigatória'),
});

export type NewAppointmentFormData = z.infer<typeof newAppointmentSchema>;

