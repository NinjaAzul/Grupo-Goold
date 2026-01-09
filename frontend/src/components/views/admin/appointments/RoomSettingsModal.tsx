'use client';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { RoomForm } from './RoomForm';
import {
  useGetAdminRooms,
  usePostAdminRooms,
  usePatchAdminRoomsId,
  useDeleteAdminRoomsId,
} from '@/api/generated/admin-rooms/admin-rooms';
import { Room, RoomFormData } from './types';
import { getGetAdminRoomsQueryKey } from '@/api/generated/admin-rooms/admin-rooms';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiRoomResponse {
  success: boolean;
  data: Room[];
}

export function RoomSettingsModal({ isOpen, onClose }: RoomSettingsModalProps) {
  const queryClient = useQueryClient();

  const { data: roomsResponse, isLoading: isLoadingRooms } = useGetAdminRooms({
    query: {
      enabled: isOpen,
    },
  });


  const rooms: Room[] =
    (roomsResponse as unknown as ApiRoomResponse)?.data || [];

  const createRoom = usePostAdminRooms({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminRoomsQueryKey() });
        toast.success('Sala criada com sucesso!');
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao criar sala. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const updateRoom = usePatchAdminRoomsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminRoomsQueryKey() });
        toast.success('Sala atualizada com sucesso!');
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar sala. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const deleteRoom = useDeleteAdminRoomsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminRoomsQueryKey() });
        toast.success('Sala deletada com sucesso!');
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao deletar sala. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const handleSubmit = (data: RoomFormData, room?: Room) => {
    if (room) {
    
      updateRoom.mutate({
        id: room.id,
        data: {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          timeBlock: data.timeBlock,
        },
      });
    } else {
  
      createRoom.mutate({
        data: {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          timeBlock: data.timeBlock,
        },
      });
    }
  };

  const handleDelete = (room: Room) => {
    if (window.confirm(`Tem certeza que deseja deletar a sala "${room.name}"?`)) {
      deleteRoom.mutate({ id: room.id });
    }
  };

  const isLoading = createRoom.isPending || updateRoom.isPending || deleteRoom.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajustes de agendamento"
      size="xs"
    >
      <div className="space-y-6">
        {isLoadingRooms ? (
          <div className="text-center py-8 text-gray-500">Carregando salas...</div>
        ) : (
          <RoomForm
            rooms={rooms}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
      </div>
    </Modal>
  );
}

