'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/@components/ui/Modal';
import { DatePicker } from '@/@components/ui/DatePicker';
import { Select } from '@/@components/ui/Select';
import { Button } from '@/@components/ui/Button';
import { usePostAppointments, useGetAppointmentsAvailableRooms, getGetAppointmentsAvailableRoomsQueryKey, useGetAppointmentsAvailable } from '@/api/generated/appointments/appointments';
import toast from 'react-hot-toast';
import { Room } from '../shared/types';
import { DateHelper } from '@/lib/date';
import { SpinnerIcon } from '@/@components/icons';
import { newAppointmentSchema, type NewAppointmentFormData } from './schemas';

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
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NewAppointmentFormData>({
    resolver: zodResolver(newAppointmentSchema),
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    setValue('time', '');
    setValue('roomId', undefined as unknown as number);
  }, [selectedDate, setValue]);

  useEffect(() => {
    setValue('roomId', undefined as unknown as number);
  }, [selectedTime, setValue]);

  const dateString = selectedDate ? DateHelper.extractDateOnly(selectedDate) : null;

  const { data: availableSlotsResponse, isLoading: isLoadingAvailableSlots } = useGetAppointmentsAvailable(
    { date: dateString || '' },
    {
      query: {
        enabled: !!dateString && isOpen,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      },
    }
  );

  const timeOptions = useMemo(() => {
    if (!availableSlotsResponse?.slots || availableSlotsResponse.slots.length === 0) {
      return [];
    }
    return availableSlotsResponse.slots.map((slot) => ({
      value: slot,
      label: slot,
    }));
  }, [availableSlotsResponse]);
  
  const availableRoomsParams = useMemo(() => {
    if (!dateString || !selectedTime) {
      return null;
    }
    return {
      date: dateString,
      time: selectedTime,
    };
  }, [dateString, selectedTime]);

  const { data: availableRoomsResponse, isLoading: isLoadingAvailableRooms } = useGetAppointmentsAvailableRooms(
    availableRoomsParams || { date: '', time: '' },
    {
      query: {
        enabled: !!availableRoomsParams && isOpen,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      },
    }
  );

  const availableRooms: Room[] =
    availableRoomsResponse?.rooms
      ?.filter(
        (room): room is NonNullable<typeof room> =>
          !!room.id && !!room.name && !!room.startTime && !!room.endTime && !!room.timeBlock
      )
      .map((room) => ({
        id: room.id!,
        name: room.name!,
        startTime: room.startTime!,
        endTime: room.endTime!,
        timeBlock: room.timeBlock!,
      })) || [];

  const createAppointment = usePostAppointments({
    mutation: {
      onSuccess: () => {
        toast.success('Agendamento criado com sucesso!');
        if (availableRoomsParams) {
          queryClient.invalidateQueries({
            queryKey: getGetAppointmentsAvailableRoomsQueryKey(availableRoomsParams),
          });
        }
        reset();
        onSuccess();
      }
    },
  });


  const formatDuration = (timeBlock: number): string => {
    if (timeBlock >= 60) {
      const hours = timeBlock / 60;
      return hours === 1 ? '1h' : `${hours}h`;
    }
    return `${timeBlock}min`;
  };

  const roomOptions = availableRooms.map((room) => ({
    value: room.id,
    label: `${room.name} (${formatDuration(room.timeBlock)})`,
  }));

  const selectedRoom = availableRooms.find((room) => room.id === watch('roomId'));

  const onSubmit = (data: NewAppointmentFormData) => {
    const [hours, minutes] = data.time.split(':');
    const dateString = `${data.date.getFullYear()}-${(data.date.getMonth() + 1).toString().padStart(2, '0')}-${data.date.getDate().toString().padStart(2, '0')}`;
    
    const appointmentDate = DateHelper.createUTCFromDateAndTime(
      dateString,
      `${hours}:${minutes}`
    );

    createAppointment.mutate({
      data: {
        appointmentDate: DateHelper.toISOString(appointmentDate),
        roomId: data.roomId,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header title="Novo Agendamento" />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="appointment-form">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Selecione uma data (Obrigatório)"
                value={field.value}
                onChange={(date) => field.onChange(date || new Date())}
                placeholder="Selecione uma data"
                minDate={new Date()}
                error={errors.date?.message}
                required
              />
            )}
          />

          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  label="Selecione um horário (Obrigatório)"
                  options={timeOptions}
                  placeholder={isLoadingAvailableSlots ? 'Carregando horários...' : 'Selecione um horário'}
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                  error={errors.time?.message}
                  required
                  disabled={!selectedDate || isLoadingAvailableSlots}
                  type="hour"
                />
                {isLoadingAvailableSlots && selectedDate && (
                  <div className="mt-2 flex items-center gap-2">
                    <SpinnerIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-500">Buscando horários disponíveis...</span>
                  </div>
                )}
                {!isLoadingAvailableSlots &&
                  selectedDate &&
                  timeOptions.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Nenhum horário disponível para esta data
                    </p>
                  )}
              </div>
            )}
          />

          <Controller
            name="roomId"
            control={control}
            render={({ field }) => {
              return (
                <div>
                  <Select
                    label="Selecione uma Sala (Obrigatório)"
                    options={roomOptions}
                    placeholder="Selecione uma Sala"
                    value={field.value}
                    onChange={(value) => {
                      const numValue = Number(value);
                      field.onChange(numValue);
                    }}
                    error={errors.roomId?.message}
                    required
                    disabled={!selectedDate || !selectedTime || isLoadingAvailableRooms}
                  />
                  {isLoadingAvailableRooms && (
                    <div className="mt-2 flex items-center gap-2">
                      <SpinnerIcon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  {!isLoadingAvailableRooms &&
                    selectedDate &&
                    selectedTime &&
                    availableRooms.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Nenhuma sala disponível para esta data e horário
                      </p>
                    )}
                  {selectedRoom && (
                    <p className="mt-2 text-xs text-gray-500">
                      Duração do agendamento: {formatDuration(selectedRoom.timeBlock)}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="appointment-form"
          variant="primary"
          isLoading={createAppointment.isPending}
          disabled={isLoadingAvailableRooms}
          className="w-full"
        >
          Confirmar Agendamento
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

