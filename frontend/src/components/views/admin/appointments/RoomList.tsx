'use client';

import { Room } from './types';
import { Button } from '@/components/ui/Button';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';

interface RoomListProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  isDeleting?: boolean;
  deletingId?: number;
}

export function RoomList({
  rooms,
  onEdit,
  onDelete,
  isDeleting = false,
  deletingId,
}: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma sala configurada ainda.</p>
        <p className="text-sm mt-2">Adicione uma nova sala usando o formulário acima.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="flex items-center justify-between p-4 border border-[#D7D7D7] rounded-lg bg-background-white"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base font-semibold text-primary">{room.name}</h3>
              <Badge variant="primary" className="bg-primary text-white">
                {room.timeBlock} min
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {room.startTime} - {room.endTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => onEdit(room)}
              disabled={isDeleting}
              className="text-sm"
            >
              Editar
            </Button>
            <ActionButton
              variant="close"
              onClick={() => onDelete(room)}
              disabled={isDeleting || deletingId === room.id}
              aria-label={`Deletar ${room.name}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

