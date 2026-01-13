'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/pagination';
import { Button } from '@/@components/ui/Button';
import { usePage } from '@/contexts/PageContext';
import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentsTable } from './AppointmentsTable';
import { NewAppointmentModal } from './NewAppointmentModal';
import { AXIOS_INSTANCE } from '@/api/mutator';
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
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Agendamento',
      'Acompanhe todos os seus agendamentos de forma simples'
    );
  }, [setPageInfo]);

  // Buscar agendamentos
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
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

        const response = await AXIOS_INSTANCE.get('/appointments', { params });
        const data = response.data as ApiAppointmentsResponse;

        const mappedAppointments = data.data.map(mapApiAppointmentToAgendamento);
        setAppointments(mappedAppointments);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        toast.error('Erro ao carregar agendamentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage, searchTerm, selectedDate, refreshKey]);

  // Ordenação client-side
  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return appointments;

    return [...appointments].sort((a, b) => {
      if (sortField === 'data') {
        const dateA = new Date(
          a.data.split(' ')[0].split('/').reverse().join('-') +
            ' ' +
            a.data.split(' ')[2]
        );
        const dateB = new Date(
          b.data.split(' ')[0].split('/').reverse().join('-') +
            ' ' +
            b.data.split(' ')[2]
        );
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
  }, [appointments, sortField, sortDirection]);

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

  const handleCancel = async (id: string) => {
    try {
      await AXIOS_INSTANCE.patch(`/appointments/${id}/cancel`);
      toast.success('Agendamento cancelado com sucesso');
      // Forçar recarregamento da lista
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        'Erro ao cancelar agendamento';
      toast.error(message);
    }
  };

  const handleAppointmentCreated = () => {
    setIsModalOpen(false);
    // Recarregar lista voltando para página 1
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background-white rounded-[5px] border border-border p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
          <AppointmentsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <Button
            variant="primary"
            className="w-full lg:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Novo Agendamento
          </Button>
        </div>
        <Divider className="mb-4" />

        <AppointmentsTable
          data={sortedData}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
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

      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAppointmentCreated}
      />
    </div>
  );
}

