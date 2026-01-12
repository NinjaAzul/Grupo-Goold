'use client';

import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { SearchIcon } from '@/components/icons';

interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function ClientsFilters({
  searchTerm,
  onSearchChange,
  selectedDate,
  onDateChange,
}: ClientsFiltersProps) {
  return (
    <div className="bg-background-white pb-4 flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-4 lg:gap-32 lg:items-end">
      <div className="w-full min-w-0 flex flex-col lg:grid lg:grid-cols-[7fr_3fr] gap-4 lg:gap-2 lg:pr-[25%]">
        <div className="w-full min-w-0">
          <Input
            label="Filtre por nome"
            type="text"
            leftIcon={<SearchIcon className="w-5 h-5 !text-black" />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Digite o nome do cliente..."
          />
        </div>
        <div className="w-full min-w-0">
          <DatePicker
            label="Data de criação"
            value={selectedDate}
            onChange={onDateChange}
            placeholder="Selecione"
          />
        </div>
      </div>
    </div>
  );
}

