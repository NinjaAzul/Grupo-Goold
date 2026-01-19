'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/Pagination';
import { usePage } from '@/contexts/PageContext';
import { ClientsFilters } from './ClientsFilters';
import { ClientsTable } from './ClientsTable';
import { useGetUsers, usePatchUsersId, usePatchUsersUserIdPermissionsPermissionId } from '@/api/generated/users/users';
import { getGetUsersQueryKey } from '@/api/generated/users/users';
import type { GetUsersParams, PatchUsersIdBody } from '@/api/generated/models';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PERMISSIONS, PERMISSION_IDS } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';
import {
  Client,
  SortField,
  SortDirection,
  ApiUsersResponse,
  ApiUser,
} from './types';
import { DateHelper } from '@/lib/date';

const mapApiUserToClient = (user: ApiUser): Client => {
  const createdAt = user.createdAt ? DateHelper.fromISOString(user.createdAt) : new Date();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  
  const addressParts = [
    user.street && user.number ? `${user.street}, ${user.number}` : user.street || '',
    user.complement || '',
    user.neighborhood || '',
    user.city?.name || '',
    user.city?.state?.uf || '',
  ].filter(Boolean);
  
  const address = addressParts.length > 0 
    ? addressParts.join(', ')
    : 'Endereço não informado';

  const permissionsMap = new Map();
  (user.permissions || []).forEach((up: NonNullable<ApiUser['permissions']>[number]) => {
    if (up.permission?.name === PERMISSIONS.APPOINTMENTS || up.permission?.name === PERMISSIONS.LOGS) {
      permissionsMap.set(up.permission.name, {
        id: up.permission.id,
        granted: up.granted,
      });
    }
  });

  const permissions = [
    {
      id: permissionsMap.get(PERMISSIONS.APPOINTMENTS)?.id || PERMISSION_IDS.APPOINTMENTS,
      name: 'Agendamentos',
      granted: permissionsMap.get(PERMISSIONS.APPOINTMENTS)?.granted || false,
    },
    {
      id: permissionsMap.get(PERMISSIONS.LOGS)?.id || PERMISSION_IDS.LOGS,
      name: 'Logs',
      granted: permissionsMap.get(PERMISSIONS.LOGS)?.granted || false,
    },
  ];

  return {
    id: String(user.id),
    registrationDate: DateHelper.formatAppointmentDate(createdAt),
    name: fullName,
    email: user.email,
    address,
    permissions,
    status: user.active !== undefined ? user.active : true,
  };
};

export function ClientsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const queryClient = useQueryClient();
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Clientes',
      'Overview de todos os clientes'
    );
  }, [setPageInfo]);

  const queryParams = useMemo((): GetUsersParams => {
    const params: GetUsersParams = {
      page: currentPage,
      limit: 10,
      roleId: ROLES.USER,
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    if (selectedDate) {
      // Usa DateHelper para extrair a data de forma segura no timezone local
      params.startDate = DateHelper.extractDateOnly(selectedDate);
      params.endDate = DateHelper.extractDateOnly(selectedDate);
    }

    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetUsers(queryParams, {});

  const usersResponse = rawData as unknown as ApiUsersResponse | undefined;

  const clients: Client[] = useMemo(() => {
    if (!usersResponse?.data) return [];
    return usersResponse.data.map(mapApiUserToClient);
  }, [usersResponse]);

  const sortedData = useMemo(() => {
    if (!sortField || sortField !== 'registrationDate' || !sortDirection) return clients;

    return [...clients].sort((a, b) => {
      const aValue = a.registrationDate;
      const bValue = b.registrationDate;

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [clients, sortField, sortDirection]);

  const totalPages = usersResponse?.pagination?.totalPages || 1;

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

  const updateUser = usePatchUsersId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetUsersQueryKey(queryParams),
        });
        toast.success('Status do cliente atualizado com sucesso!');
      },
    },
  });

  const handleToggleStatus = (id: string, status: boolean) => {
    updateUser.mutate({
      id: Number(id),
      data: { active: status } as PatchUsersIdBody,
    });
  };

  const updatePermission = usePatchUsersUserIdPermissionsPermissionId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetUsersQueryKey(queryParams),
        });
        toast.success('Permissão atualizada com sucesso!');
      },
    },
  });

  const handleTogglePermission = (
    userId: string,
    permissionId: number,
    granted: boolean
  ) => {
    updatePermission.mutate({
      userId: Number(userId),
      permissionId,
      data: { granted },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-background-white rounded-[5px] border border-border p-4 lg:p-8">
        <ClientsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Divider className="mb-4" />

        <ClientsTable
          data={sortedData}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onToggleStatus={handleToggleStatus}
          onTogglePermission={handleTogglePermission}
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

