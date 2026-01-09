'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { RoomFormItem } from './RoomFormItem';
import { Room, RoomFormData } from './types';

interface RoomFormProps {
  rooms?: Room[];
  onSubmit: (data: RoomFormData, room?: Room) => void;
  onDelete?: (room: Room) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  onAddNew?: () => void;
}

export function RoomForm({
  rooms = [],
  onSubmit,
  onDelete,
  onCancel: _onCancel,
  isLoading = false,
  onAddNew: _onAddNew,
}: RoomFormProps) {
  // Array de formulários: salas existentes + novas salas
  const [formRooms, setFormRooms] = useState<(Room | null)[]>(() => {
    // Inicializa com as salas existentes
    return rooms.length > 0 ? [...rooms] : [];
  });

  // Atualiza o estado quando as salas mudarem (após criar/atualizar)
  useEffect(() => {
    // Mantém as novas salas (null) e atualiza as existentes
    setFormRooms((prev) => {
      const newForms = prev.filter((r) => r === null); // Mantém forms novos
      const existingRooms = rooms; // Salas atualizadas da API
      return [...existingRooms, ...newForms];
    });
  }, [rooms]);

  const handleAddNew = () => {
    // Adiciona um novo form vazio (null = nova sala)
    setFormRooms([...formRooms, null]);
  };

  const handleSubmit = (data: RoomFormData, room?: Room) => {
    onSubmit(data, room);
    // Se for uma nova sala (null), remove do array após salvar
    if (!room) {
      setFormRooms((prev) => prev.filter((r) => r !== null));
    }
  };

  const handleRemoveNewForm = (index: number) => {
    setFormRooms((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
 
      {formRooms.map((room, index) => (
        <div key={room?.id || `new-${index}`}>
          <RoomFormItem
            room={room || undefined}
            onSubmit={(data) => handleSubmit(data, room || undefined)}
            onCancel={room ? undefined : () => handleRemoveNewForm(index)}
            onDelete={room && onDelete ? () => onDelete(room) : undefined}
            isLoading={isLoading}
            showCancel={!room}
          />
          {index < formRooms.length - 1 && (
            <Divider className={index === 0 ? 'mt-6' : 'mt-6'} />
          )}
        </div>
      ))}

      
      {formRooms.length > 0 && <Divider />}
      <div className="flex justify-start">
        <Button variant="link" onClick={handleAddNew} disabled={isLoading}>
          <span className="flex items-center gap-2">
            <span>+</span>
            <span>Adicionar nova sala</span>
          </span>
        </Button>
      </div>
    </div>
  );
}

