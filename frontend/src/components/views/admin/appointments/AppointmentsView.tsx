'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Divider } from '@/components/ui/Divider';
import { Pagination } from '@/components/ui/pagination';
import { usePage } from '@/contexts/PageContext';
import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentsTable } from './AppointmentsTable';
import {
  useGetAdminAppointments,
  usePatchAdminAppointmentsIdStatus,
} from '@/api/generated/admin-appointments/admin-appointments';
import { getGetAdminAppointmentsQueryKey } from '@/api/generated/admin-appointments/admin-appointments';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Agendamento,
  SortField,
  SortDirection,
  ApiAppointmentsResponse,
} from './types';

// Função para mapear dados da API para o formato do componente
const mapApiAppointmentToAgendamento = (
  appointment: any
): Agendamento => {
  const appointmentDate = new Date(appointment.appointmentDate);
  const userName = appointment.user
    ? `${appointment.user.firstName} ${appointment.user.lastName}`.trim()
    : 'Usuário não encontrado';
  const userEmail = appointment.user?.email || '';

  // Mapear status do backend para o formato do frontend
  const statusMap: Record<string, 'agendado' | 'cancelado' | 'em_analise'> = {
    scheduled: 'agendado',
    cancelled: 'cancelado',
    pending: 'em_analise',
  };

  return {
    id: String(appointment.id),
    data: format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
    nome: userName,
    tipo: userEmail,
    sala: appointment.room,
    status: statusMap[appointment.status] || 'em_analise',
  };
};

export function AppointmentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const queryClient = useQueryClient();
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Agendamentos',
      'Acompanhe todos os agendamentos de clientes de forma simples'
    );
  }, [setPageInfo]);

  // Preparar parâmetros da query
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      params.startDate = startOfDay.toISOString().split('T')[0];
      params.endDate = endOfDay.toISOString().split('T')[0];
    }

    // Se houver ordenação, aplicar (o backend ordena por appointmentDate DESC por padrão)
    // Por enquanto, vamos manter a ordenação do backend e adicionar ordenação client-side se necessário

    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetAdminAppointments(
    queryParams,
    {}
  );

  // Cast do tipo void para ApiAppointmentsResponse
  const appointmentsResponse = rawData as unknown as
    | ApiAppointmentsResponse
    | undefined;

  // Mapear dados da API para o formato do componente
  const appointments: Agendamento[] = useMemo(() => {
    if (!appointmentsResponse?.data) return [];
    return appointmentsResponse.data.map(mapApiAppointmentToAgendamento);
  }, [appointmentsResponse]);

  // Aplicar ordenação client-side se necessário
  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return appointments;

    return [...appointments].sort((a, b) => {
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
  }, [appointments, sortField, sortDirection]);

  const totalPages =
    appointmentsResponse?.pagination?.totalPages || 1;

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

  const updateStatus = usePatchAdminAppointmentsIdStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAdminAppointmentsQueryKey(queryParams),
        });
        toast.success('Status do agendamento atualizado com sucesso!');
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar status. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const handleApprove = (id: string) => {
    updateStatus.mutate({
      id: Number(id),
      data: { status: 'scheduled' },
    });
  };

  const handleCancel = (id: string) => {
    updateStatus.mutate({
      id: Number(id),
      data: { status: 'cancelled' },
    });
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
      
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

