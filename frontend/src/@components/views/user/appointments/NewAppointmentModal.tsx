'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/@components/ui/Modal';
import { DatePicker } from '@/@components/ui/DatePicker';
import { Select } from '@/@components/ui/Select';
import { Button } from '@/@components/ui/Button';
import { ClockIcon, CalendarIcon } from '@/@components/icons';
import { AXIOS_INSTANCE } from '@/api/mutator';
import toast from 'react-hot-toast';
import { Room } from './types';

const newAppointmentSchema = z.object({
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  time: z.string().min(1, 'Horário é obrigatório'),
  roomId: z.number().min(1, 'Sala é obrigatória'),
});

type NewAppointmentFormData = z.infer<typeof newAppointmentSchema>;

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: NewAppointmentModalProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<NewAppointmentFormData>({
    resolver: zodResolver(newAppointmentSchema),
  });

  const selectedDate = watch('date');
  const selectedRoomId = watch('roomId');

  // Buscar salas disponíveis
  useEffect(() => {
    if (isOpen) {
      setIsLoadingRooms(true);
      AXIOS_INSTANCE.get('/admin/rooms')
        .then((response) => {
          setRooms(response.data || []);
        })
        .catch(() => {
          toast.error('Erro ao carregar salas');
        })
        .finally(() => {
          setIsLoadingRooms(false);
        });
    }
  }, [isOpen]);

  // Buscar horários disponíveis quando data e sala são selecionados
  useEffect(() => {
    if (selectedDate && selectedRoomId) {
      setIsLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      AXIOS_INSTANCE.get('/appointments/available', {
        params: {
          date: dateStr,
          roomId: selectedRoomId,
        },
      })
        .then((response) => {
          setAvailableSlots(response.data.slots || []);
        })
        .catch(() => {
          toast.error('Erro ao carregar horários disponíveis');
          setAvailableSlots([]);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedRoomId]);

  const onSubmit = async (data: NewAppointmentFormData) => {
    setIsSubmitting(true);
    try {
      // Combinar data e horário
      const [hours, minutes] = data.time.split(':');
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);

      const selectedRoom = rooms.find((r) => r.id === data.roomId);

      await AXIOS_INSTANCE.post('/appointments', {
        appointmentDate: appointmentDate.toISOString(),
        room: selectedRoom?.name || '',
      });

      toast.success('Agendamento criado com sucesso!');
      reset();
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        'Erro ao criar agendamento';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = availableSlots.map((slot) => ({
    value: slot,
    label: slot,
  }));

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Agendamento"
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <DatePicker
          label="Selecione uma data (Obrigatório)"
          value={selectedDate}
          onChange={(date) => setValue('date', date || new Date(), { shouldValidate: true })}
          placeholder="Selecione uma data"
          minDate={new Date()}
          error={errors.date?.message}
          required
        />

        <Select
          label="Selecione um Sala (Obrigatório)"
          options={roomOptions}
          placeholder="Selecione um Sala"
          {...register('roomId', { valueAsNumber: true })}
          error={errors.roomId?.message}
          required
          disabled={isLoadingRooms}
        />

        <div className="relative">
          <label className="block text-sm font-medium text-primary mb-2">
            Selecione um horário (Obrigatório)
            <span className="text-error ml-1">*</span>
          </label>
          <div className="relative">
            <select
              {...register('time')}
              className={`w-full py-3 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none cursor-pointer ${
                errors.time ? 'border-error' : 'border-gray-300'
              } ${isLoadingSlots ? 'opacity-50' : ''}`}
              disabled={!selectedDate || !selectedRoomId || isLoadingSlots}
            >
              <option value="">Selecione um horário</option>
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ClockIcon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          {errors.time && (
            <p className="mt-1 text-sm text-error">{errors.time.message}</p>
          )}
          {isLoadingSlots && (
            <p className="mt-1 text-sm text-gray-500">
              Carregando horários disponíveis...
            </p>
          )}
          {!isLoadingSlots && selectedDate && selectedRoomId && availableSlots.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Nenhum horário disponível para esta data e sala
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full"
          disabled={isLoadingSlots || isLoadingRooms}
        >
          Confirmar Agendamento
        </Button>
      </form>
    </Modal>
  );
}

