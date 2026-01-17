'use client';

import { useState } from 'react';
import { Button } from '@/@components/ui/Button';
import { Input } from '@/@components/ui/Input';
import { DatePicker } from '@/@components/ui/DatePicker';
import { SearchIcon } from '@/@components/icons';
import { NewAppointmentModal } from '../modals/NewAppointmentModal';

interface AppointmentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onAppointmentCreated?: () => void;
}

export function AppointmentsFilters({
  searchTerm,
  onSearchChange,
  selectedDate,
  onDateChange,
  onAppointmentCreated,
}: AppointmentsFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    if (onAppointmentCreated) {
      onAppointmentCreated();
    }
  };

  return (
    <>
      <div className="bg-background-white pb-4 flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-4 lg:gap-32 lg:items-end">
        <div className="w-full min-w-0 flex flex-col lg:grid lg:grid-cols-[7fr_3fr] gap-4 lg:gap-2">
          <div className="w-full min-w-0">
            <Input
              type="text"
              leftIcon={<SearchIcon className="w-5 h-5 !text-black" />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtre por nome"
            />
          </div>
          <div className="w-full min-w-0">
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              placeholder="Selecione"
            />
          </div>
        </div>
        <div className="w-full lg:w-auto lg:ml-3">
          <Button
            variant="primary"
            className="w-full lg:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
