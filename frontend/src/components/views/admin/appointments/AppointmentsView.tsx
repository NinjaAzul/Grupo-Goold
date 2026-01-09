'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/components/ui/Divider';
import { Pagination } from '@/components/ui/pagination';
import { usePage } from '@/contexts/PageContext';
import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentsTable } from './AppointmentsTable';
import { mockData } from './mockData';
import {  SortField, SortDirection } from './types';

export function AppointmentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const totalPages = 3;
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Agendamentos',
      'Acompanhe todos os agendamentos de clientes de forma simples'
    );
  }, [setPageInfo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return mockData;

    return [...mockData].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortField === 'data') {
        aValue = a.data;
        bValue = b.data;
      } else {
        aValue = a.nome;
        bValue = b.nome;
      }

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [sortField, sortDirection]);

  const handleApprove = (_id: string) => {
    // TODO: Implementar lógica de aprovação
  };

  const handleCancel = (_id: string) => {
    // TODO: Implementar lógica de cancelamento
  };

  return (
    <div className="space-y-6">
      <div className="bg-background-white rounded-[5px] border border-[#D7D7D7] p-4 lg:p-8">
        <AppointmentsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Divider className="mb-4" />

        <AppointmentsTable
          data={sortedData}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

