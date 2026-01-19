'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/@components/ui/Modal';
import { DatePicker } from '@/@components/ui/DatePicker';
import { Select } from '@/@components/ui/Select';
import { Button } from '@/@components/ui/Button';
import { useGetRooms } from '@/api/generated/rooms/rooms';
import { useGetAppointmentsAvailable, getGetAppointmentsAvailableQueryKey } from '@/api/generated/appointments/appointments';
import { usePostAppointments } from '@/api/generated/appointments/appointments';
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
  const selectedRoomId = watch('roomId');

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    setValue('time', '');
  }, [selectedDate, selectedRoomId, setValue]);

  const { data: roomsResponse, isLoading: isLoadingRooms, error: roomsError } = useGetRooms({
    query: {
      enabled: isOpen,
    },
  });


  const rooms: Room[] =
    (roomsResponse as unknown as { data?: Room[] })?.data || [];

  const dateString = selectedDate ? DateHelper.extractDateOnly(selectedDate) : null;
  
  const slotsParams = useMemo(() => {
    if (!dateString || !selectedRoomId) {
      return null;
    }
    const params = {
      date: dateString,
      roomId: selectedRoomId,
    };
    return params;
  }, [dateString, selectedRoomId]);

  const { data: slotsResponse, isLoading: isLoadingSlots, error: slotsError } =
    useGetAppointmentsAvailable(
      slotsParams || { date: '', roomId: undefined },
      {
        query: {
          enabled: !!slotsParams,
          staleTime: 0, 
          refetchOnMount: true,
          refetchOnWindowFocus: false,
        },
      }
    );

  const availableSlots: string[] =
    (slotsResponse as unknown as { slots?: string[] })?.slots || [];

  const createAppointment = usePostAppointments({
    mutation: {
      onSuccess: () => {
        toast.success('Agendamento criado com sucesso!');
        if (slotsParams) {
          queryClient.invalidateQueries({
            queryKey: getGetAppointmentsAvailableQueryKey(slotsParams),
          });
        }
        reset();
        onSuccess();
      }
    },
  });

  const onSubmit = (data: NewAppointmentFormData) => {
    const [hours, minutes] = data.time.split(':');
    const dateString = `${data.date.getFullYear()}-${(data.date.getMonth() + 1).toString().padStart(2, '0')}-${data.date.getDate().toString().padStart(2, '0')}`;
    
    const appointmentDate = DateHelper.createUTCFromDateAndTime(
      dateString,
      `${hours}:${minutes}`
    );

    const selectedRoom = rooms.find((r) => r.id === data.roomId);

    createAppointment.mutate({
      data: {
        appointmentDate: DateHelper.toISOString(appointmentDate),
        room: selectedRoom?.name || '',
      },
    });
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
            name="roomId"
            control={control}
            render={({ field }) => {
              return (
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
                  disabled={isLoadingRooms}
                />
              );
            }}
          />

          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  label="Selecione um horário (Obrigatório)"
                  options={timeOptions}
                  placeholder="Selecione um horário"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  error={errors.time?.message}
                  required
                  disabled={!selectedDate || !selectedRoomId || isLoadingSlots}
                  type="hour"
                />
                {isLoadingSlots && (
                  <div className="mt-2 flex items-center gap-2">
                    <SpinnerIcon className="w-5 h-5 text-primary" />
                  </div>
                )}
                {!isLoadingSlots &&
                  selectedDate &&
                  selectedRoomId &&
                  availableSlots.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Nenhum horário disponível para esta data e sala
                    </p>
                  )}
              </div>
            )}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="appointment-form"
          variant="primary"
          isLoading={createAppointment.isPending}
          disabled={isLoadingSlots || isLoadingRooms}
          className="w-full"
        >
          Confirmar Agendamento
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

