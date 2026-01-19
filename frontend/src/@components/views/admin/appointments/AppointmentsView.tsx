'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/Pagination';
import { usePage } from '@/contexts/PageContext';
import { AppointmentsFilters } from './components/AppointmentsFilters';
import { AppointmentsTable } from './components/AppointmentsTable';
import {
  useGetAdminAppointments,
  usePatchAdminAppointmentsIdStatus,
} from '@/api/generated/admin-appointments/admin-appointments';
import { getGetAdminAppointmentsQueryKey } from '@/api/generated/admin-appointments/admin-appointments';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Appointment,
  SortField,
  SortDirection,
  ApiAppointmentsResponse,
  ApiAppointment,
} from './shared/types';
import type { GetAdminAppointmentsParams } from '@/api/generated/models';
import { DateHelper } from '@/lib/date';

const mapApiAppointmentToAppointment = (appointment: ApiAppointment): Appointment => {
  const appointmentDate = DateHelper.fromISOString(appointment.appointmentDate);
  const userName = appointment.user
    ? `${appointment.user.firstName} ${appointment.user.lastName}`.trim()
    : 'Usuário não encontrado'; 
  const userEmail = appointment.user?.email || '';

  const statusMap: Record<string, 'scheduled' | 'cancelled' | 'pending'> = {
    scheduled: 'scheduled',
    cancelled: 'cancelled',
    pending: 'pending',
  };


  const roomName = appointment.room?.name || 'Sala não encontrada';

  return {
    id: String(appointment.id),
    date: DateHelper.formatAppointmentDate(appointmentDate),
    name: userName,
    type: userEmail,
    room: roomName,
    status: statusMap[appointment.status] || 'pending',
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const queryParams = useMemo((): GetAdminAppointmentsParams => {
    const params: GetAdminAppointmentsParams = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    if (selectedDate) {
      params.startDate = DateHelper.extractDateOnly(selectedDate);
      params.endDate = DateHelper.extractDateOnly(selectedDate);
    }

    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetAdminAppointments(
    queryParams,
    {}
  );

  const appointmentsResponse = rawData as unknown as
    | ApiAppointmentsResponse
    | undefined;

  const appointments: Appointment[] = useMemo(() => {
    if (!appointmentsResponse?.data) return [];
    return appointmentsResponse.data.map(mapApiAppointmentToAppointment);
  }, [appointmentsResponse]);

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return appointments;

    return [...appointments].sort((a, b) => {
      const aValue = a.date;
      const bValue = b.date;

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
      <div className="bg-background-white rounded-[5px] border border-border p-4 lg:p-8">
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

