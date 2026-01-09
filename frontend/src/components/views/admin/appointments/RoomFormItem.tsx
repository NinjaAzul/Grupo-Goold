'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { TimeRangeInput } from '@/components/ui/TimeRangeInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Room, RoomFormData } from './types';

const roomSchema = z
  .object({
    name: z.string().min(1, 'Nome da sala é obrigatório'),
    startTime: z
      .string()
      .min(1, 'Horário inicial é obrigatório')
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (use HH:mm)'),
    endTime: z
      .string()
      .min(1, 'Horário final é obrigatório')
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (use HH:mm)'),
    timeBlock: z
      .number()
      .min(15, 'Tempo de atendimento deve ser no mínimo 15 minutos')
      .int('Tempo de atendimento deve ser um número inteiro'),
  })
  .refine((data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  }, 'Horário final deve ser maior que o horário inicial');

interface RoomFormItemProps {
  room?: Room;
  onSubmit: (data: RoomFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  showCancel?: boolean;
}

const timeBlockOptions = [15, 30, 45, 60];

export function RoomFormItem({
  room,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
  showCancel = false,
}: RoomFormItemProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          name: room.name,
          startTime: room.startTime,
          endTime: room.endTime,
          timeBlock: room.timeBlock,
        }
      : {
          name: '',
          startTime: '',
          endTime: '',
          timeBlock: 30,
        },
  });

  const timeBlock = watch('timeBlock');

  const handleTimeBlockChange = (value: number | undefined) => {
    if (value !== undefined) {
      setValue('timeBlock', value, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome da sala"
        {...register('name')}
        error={errors.name?.message}
        required
        disabled={isLoading}
        placeholder="Ex: Sala 012"
      />

      <TimeRangeInput
        label="Horário Inicial & Final da sala"
        startTime={watch('startTime')}
        endTime={watch('endTime')}
        onChange={(start, end) => {
          setValue('startTime', start, { shouldValidate: true });
          setValue('endTime', end, { shouldValidate: true });
        }}
        error={errors.startTime?.message || errors.endTime?.message}
        required
        disabled={isLoading}
      />

      <Select
        label="Bloco de Horários de agendamento"
        value={timeBlock}
        onChange={(e) => handleTimeBlockChange(Number(e.target.value))}
        disabled={isLoading}
        error={errors.timeBlock?.message}
        required
        options={timeBlockOptions.map((option) => ({
          value: option,
          label: `${option} minutos`,
        }))}
      />

      {errors.root && (
        <div className="p-3 rounded-lg bg-error-light border border-error">
          <p className="text-sm text-error">{errors.root.message}</p>
        </div>
      )}

      {showCancel && onCancel && (
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            Salvar
          </Button>
        </div>
      )}

      {!showCancel && (
        <div className="flex gap-4 pt-4">
          {onDelete && room ? (
            <>
              <Button
                type="button"
                variant="error"
                onClick={onDelete}
                disabled={isLoading}
                className="flex-1"
              >
                Deletar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Salvar
              </Button>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Salvar
              </Button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

