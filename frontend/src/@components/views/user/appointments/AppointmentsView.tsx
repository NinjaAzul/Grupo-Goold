'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/Pagination';
import { usePage } from '@/contexts/PageContext';
import { AppointmentsFilters } from './components/AppointmentsFilters';
import { AppointmentsTable } from './components/AppointmentsTable';
import { useGetAppointments } from '@/api/generated/appointments/appointments';
import { usePatchAppointmentsIdCancel } from '@/api/generated/appointments/appointments';
import { getGetAppointmentsQueryKey } from '@/api/generated/appointments/appointments';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Appointment,
  SortField,
  SortDirection,
  ApiAppointmentsResponse,
  ApiAppointment,
} from './shared/types';
import { GetAppointmentsParams } from '@/api/generated/models';
import { sortAppointments } from './shared/utils';
import { DateHelper } from '@/lib/date';

const mapApiAppointmentToAppointment = (
  appointment: ApiAppointment
): Appointment => {
  const userName = appointment.user
    ? `${appointment.user.firstName} ${appointment.user.lastName}`.trim()
    : 'Usuário não encontrado';
  const userEmail = appointment.user?.email || '';

  const statusMap: Record<string, 'scheduled' | 'cancelled' | 'pending'> = {
    scheduled: 'scheduled',
    cancelled: 'cancelled',
    pending: 'pending',
  };

  return {
    id: String(appointment.id),
    date: DateHelper.formatAppointmentDate(appointment.appointmentDate),
    name: userName,
    type: userEmail,
    room: appointment.room,
    status: statusMap[appointment.status] || 'pending',
  };
};

export function AppointmentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const queryClient = useQueryClient();
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Agendamento',
      'Acompanhe todos os seus agendamentos de forma simples'
    );
  }, [setPageInfo]);

  const queryParams = useMemo(() => {
    const params: GetAppointmentsParams = {
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

    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetAppointments(
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

  const totalPages =
    appointmentsResponse?.pagination?.totalPages || 1;

  const sortedData = useMemo(() => {
    return sortAppointments(appointments, sortField, sortDirection);
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

  const cancelAppointment = usePatchAppointmentsIdCancel({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAppointmentsQueryKey(queryParams),
        });
        toast.success('Agendamento cancelado com sucesso');
      },
    },
  });

  const handleCancel = (id: string) => {
    cancelAppointment.mutate({ id: Number(id) });
  };

  const handleAppointmentCreated = () => {
    setCurrentPage(1);
    queryClient.invalidateQueries({
      queryKey: getGetAppointmentsQueryKey(queryParams),
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
          onAppointmentCreated={handleAppointmentCreated}
        />
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
    </div>
  );
}

