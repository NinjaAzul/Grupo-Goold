'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/pagination';
import { usePage } from '@/contexts/PageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LogsFilters } from './LogsFilters';
import { LogsTable } from './LogsTable';
import { AXIOS_INSTANCE } from '@/api/mutator';
import { Log, SortField, SortDirection, ApiLogsResponse, ApiLog } from './types';

// Função para mapear dados da API para o formato do componente
const mapApiLogToLog = (apiLog: ApiLog): Log => {
  const createdAt = apiLog.createdAt ? new Date(apiLog.createdAt) : new Date();

  return {
    id: String(apiLog.id),
    tipoAtividade: apiLog.activityType,
    modulo: apiLog.module,
    dataHorario: format(createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
  };
};

export function LogsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { setPageInfo } = usePage();
  const { user } = useAuth();

  useEffect(() => {
    setPageInfo('Logs', 'Acompanhe todos as suas Logs');
  }, [setPageInfo]);

  // Verificar se usuário tem permissão LOGS
  const hasLogsPermission = useMemo(() => {
    if (!user?.permissions) return false;
    const permission = user.permissions.find(
      (p) => p.permission.name === 'LOGS'
    );
    return permission?.granted === true;
  }, [user]);

  // Buscar logs
  useEffect(() => {
    if (!hasLogsPermission) {
      setIsLoading(false);
      return;
    }

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: 10,
        };

        if (searchTerm) {
          params.activityType = searchTerm;
          params.module = searchTerm;
        }

        if (selectedDate) {
          const startOfDay = new Date(selectedDate);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(selectedDate);
          endOfDay.setHours(23, 59, 59, 999);
          params.startDate = startOfDay.toISOString().split('T')[0];
          params.endDate = endOfDay.toISOString().split('T')[0];
        }

        const response = await AXIOS_INSTANCE.get('/logs/me', { params });
        const data = response.data as ApiLogsResponse;

        const mappedLogs = data.data.map(mapApiLogToLog);
        setLogs(mappedLogs);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Erro ao carregar logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, searchTerm, selectedDate, hasLogsPermission]);

  // Filtro client-side por tipo de atividade ou módulo
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;

    const searchLower = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.tipoAtividade.toLowerCase().includes(searchLower) ||
        log.modulo.toLowerCase().includes(searchLower)
    );
  }, [logs, searchTerm]);

  // Aplicar ordenação (apenas por data)
  const sortedData = useMemo(() => {
    if (!sortField || sortField !== 'data' || !sortDirection) {
      return filteredLogs;
    }

    const sorted = [...filteredLogs].sort((a, b) => {
      const dateA = new Date(
        a.dataHorario.split(' ')[0].split('/').reverse().join('-') +
          ' ' +
          a.dataHorario.split(' ')[2]
      );
      const dateB = new Date(
        b.dataHorario.split(' ')[0].split('/').reverse().join('-') +
          ' ' +
          b.dataHorario.split(' ')[2]
      );
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return sorted;
  }, [filteredLogs, sortField, sortDirection]);

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

  if (!hasLogsPermission) {
    return (
      <div className="bg-background-white rounded-[5px] border border-border p-8 text-center">
        <p className="text-gray-600">
          Você não tem permissão para visualizar logs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-background-white rounded-[5px] border border-border p-4 lg:p-8">
        <LogsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Divider className="mb-4" />

        <LogsTable
          data={sortedData}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
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

