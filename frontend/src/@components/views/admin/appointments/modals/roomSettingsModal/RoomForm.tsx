'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/@components/ui/Button';
import { Divider } from '@/@components/ui/Divider';
import { RoomFormItem } from './RoomFormItem';
import { Room, RoomFormData } from '../../shared/types';

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
  const [formRooms, setFormRooms] = useState<(Room | null)[]>(() => {
    return rooms.length > 0 ? [...rooms] : [];
  });

  useEffect(() => {
    setFormRooms((prev) => {
      const newForms = prev.filter((r) => r === null);
      const existingRooms = rooms;
      return [...existingRooms, ...newForms];
    });
  }, [rooms]);

  const handleAddNew = () => {
    setFormRooms([...formRooms, null]);
  };

  const handleSubmit = (data: RoomFormData, room?: Room) => {
    onSubmit(data, room);
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

