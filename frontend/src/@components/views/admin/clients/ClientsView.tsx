'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/pagination';
import { usePage } from '@/contexts/PageContext';
import { ClientsFilters } from './ClientsFilters';
import { ClientsTable } from './ClientsTable';
import { useGetUsers, usePatchUsersId } from '@/api/generated/users/users';
import { getGetUsersQueryKey } from '@/api/generated/users/users';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AXIOS_INSTANCE } from '@/api/mutator';
import toast from 'react-hot-toast';
import {
  Cliente,
  SortField,
  SortDirection,
  ApiUsersResponse,
  ApiUser,
} from './types';

// Função para mapear dados da API para o formato do componente
const mapApiUserToCliente = (user: ApiUser): Cliente => {
  const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  
  // Construir endereço completo
  const addressParts = [
    user.street && user.number ? `${user.street}, ${user.number}` : user.street || '',
    user.complement || '',
    user.neighborhood || '',
    user.city?.name || '',
    user.city?.state?.uf || '',
  ].filter(Boolean);
  
  const endereco = addressParts.length > 0 
    ? addressParts.join(', ')
    : 'Endereço não informado';

  // Mapear permissões do backend (apenas APPOINTMENTS e LOGS)
  // Sempre mostrar ambas, mesmo que não existam no banco (granted = false por padrão)
  const permissionsMap = new Map();
  (user.permissions || []).forEach((up: any) => {
    if (up.permission?.name === 'APPOINTMENTS' || up.permission?.name === 'LOGS') {
      permissionsMap.set(up.permission.name, {
        id: up.permission.id,
        granted: up.granted,
      });
    }
  });

  const permissoes = [
    {
      id: permissionsMap.get('APPOINTMENTS')?.id || 1,
      name: 'Agendamentos',
      granted: permissionsMap.get('APPOINTMENTS')?.granted || false,
    },
    {
      id: permissionsMap.get('LOGS')?.id || 2,
      name: 'Logs',
      granted: permissionsMap.get('LOGS')?.granted || false,
    },
  ];

  return {
    id: String(user.id),
    dataCadastro: format(createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
    nome: fullName,
    email: user.email,
    endereco,
    permissoes,
    status: user.active !== undefined ? user.active : true, // Usar campo active do backend
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

  // Preparar parâmetros da query
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
      roleId: 2, // Apenas usuários (não admins)
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    // Filtro por data de criação
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

  const { data: rawData, isLoading } = useGetUsers(queryParams, {});

  // Cast do tipo void para ApiUsersResponse
  const usersResponse = rawData as unknown as ApiUsersResponse | undefined;

  // Mapear dados da API para o formato do componente
  const clients: Cliente[] = useMemo(() => {
    if (!usersResponse?.data) return [];
    return usersResponse.data.map(mapApiUserToCliente);
  }, [usersResponse]);

  // Filtro de status agora é feito no backend, não precisa filtrar client-side

  // Aplicar ordenação client-side (apenas por data de cadastro)
  const sortedData = useMemo(() => {
    if (!sortField || sortField !== 'dataCadastro' || !sortDirection) return clients;

    return [...clients].sort((a, b) => {
      const aValue = a.dataCadastro;
      const bValue = b.dataCadastro;

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
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar status. Tente novamente.';
        toast.error(errorMessage);
      },
    },
  });

  const handleToggleStatus = (id: string, status: boolean) => {
    updateUser.mutate({
      id: Number(id),
      data: { active: status } as any,
    });
  };

  const updatePermission = useMutation({
    mutationFn: async ({
      userId,
      permissionId,
      granted,
    }: {
      userId: number;
      permissionId: number;
      granted: boolean;
    }) => {
      const response = await AXIOS_INSTANCE.patch(
        `/users/${userId}/permissions/${permissionId}`,
        { granted }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      
      queryClient.invalidateQueries({
        queryKey: getGetUsersQueryKey(queryParams),
      });
  
      queryClient.refetchQueries({
        queryKey: getGetUsersQueryKey(queryParams),
      });
      toast.success('Permissão atualizada com sucesso!');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar permissão. Tente novamente.';
      toast.error(errorMessage);
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
      granted,
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

