'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/pagination';
import { usePage } from '@/contexts/PageContext';
import { LogsFilters } from './LogsFilters';
import { LogsTable } from './LogsTable';
import { useGetLogs } from '@/api/generated/logs/logs';
import { Log, SortField, SortDirection, ApiLog, ApiLogsResponse } from './types';

// Função para mapear dados da API para o formato do componente
const mapApiLogToLog = (apiLog: ApiLog): Log => {
  const createdAt = apiLog.createdAt ? new Date(apiLog.createdAt) : new Date();
  const clienteNome = apiLog.user
    ? `${apiLog.user.firstName} ${apiLog.user.lastName}`.trim()
    : 'Sistema';
  const clienteEmail = apiLog.user?.email || '';

  return {
    id: String(apiLog.id),
    clienteNome,
    clienteEmail,
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
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo('Logs', 'Acompanhe todos as Logs de clientes');
  }, [setPageInfo]);

  // Preparar parâmetros da query
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };

    // Filtro por data
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      params.startDate = startOfDay.toISOString().split('T')[0];
      params.endDate = endOfDay.toISOString().split('T')[0];
    }

    // Nota: A busca por cliente será feita client-side após receber os dados
    // pois o backend não tem filtro por nome do usuário diretamente
    // Podemos filtrar por activityType ou module se necessário

    return params;
  }, [currentPage, selectedDate]);

  const { data: rawData, isLoading } = useGetLogs(queryParams, {});

  // Cast do tipo void para ApiLogsResponse
  const logsResponse = rawData as unknown as ApiLogsResponse | undefined;

  // Mapear dados da API para o formato do componente, mantendo dados originais para ordenação
  const logsWithOriginal: Array<Log & { originalCreatedAt: Date }> = useMemo(() => {
    if (!logsResponse?.data) return [];

    return logsResponse.data.map((apiLog) => {
      const log = mapApiLogToLog(apiLog);
      const originalCreatedAt = apiLog.createdAt ? new Date(apiLog.createdAt) : new Date();
      return { ...log, originalCreatedAt };
    });
  }, [logsResponse]);

  // Filtro client-side por nome, email do cliente, tipo de atividade ou módulo
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logsWithOriginal;

    const searchLower = searchTerm.toLowerCase();
    return logsWithOriginal.filter(
      (log) =>
        log.clienteNome.toLowerCase().includes(searchLower) ||
        log.clienteEmail.toLowerCase().includes(searchLower) ||
        log.tipoAtividade.toLowerCase().includes(searchLower) ||
        log.modulo.toLowerCase().includes(searchLower)
    );
  }, [logsWithOriginal, searchTerm]);

  // Aplicar ordenação (apenas por data)
  const sortedData = useMemo(() => {
    if (!sortField || sortField !== 'data' || !sortDirection) {
      return filteredLogs.map(({ originalCreatedAt: _originalCreatedAt, ...log }) => log);
    }

    const sorted = [...filteredLogs].sort((a, b) => {
      // Ordenar por data usando o Date original
      const aTime = a.originalCreatedAt.getTime();
      const bTime = b.originalCreatedAt.getTime();
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    });

    // Remover originalCreatedAt antes de retornar
    return sorted.map(({ originalCreatedAt: _originalCreatedAt, ...log }) => log);
  }, [filteredLogs, sortField, sortDirection]);

  // Calcular totalPages considerando o filtro client-side
  const totalPages = useMemo(() => {
    if (!logsResponse?.pagination) return 1;
    
    // Se há filtro de busca, precisamos recalcular as páginas
    if (searchTerm) {
      const totalFiltered = filteredLogs.length;
      return Math.ceil(totalFiltered / 10) || 1;
    }
    
    return logsResponse.pagination.totalPages || 1;
  }, [logsResponse, searchTerm, filteredLogs.length]);

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

