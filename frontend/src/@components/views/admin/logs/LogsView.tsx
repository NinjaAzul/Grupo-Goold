'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/Pagination';
import { usePage } from '@/contexts/PageContext';
import { LogsFilters } from './LogsFilters';
import { LogsTable } from './LogsTable';
import { useGetLogs } from '@/api/generated/logs/logs';
import { Log, SortField, SortDirection, ApiLog, ApiLogsResponse } from './types';
import { GetLogsParams } from '@/api/generated/models';
import { DateHelper } from '@/lib/date';

const mapApiLogToLog = (apiLog: ApiLog): Log => {
  const createdAt = apiLog.createdAt ? DateHelper.fromISOString(apiLog.createdAt) : new Date();
  const clientName = apiLog.user
    ? `${apiLog.user.firstName} ${apiLog.user.lastName}`.trim()
    : 'Sistema';
  const clientEmail = apiLog.user?.email || '';

  return {
    id: String(apiLog.id),
    clientName,
    clientEmail,
    activityType: apiLog.activityType,
    module: apiLog.module,
    dateTime: DateHelper.formatAppointmentDate(createdAt),
  };
};

export function LogsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo('Logs', 'Acompanhe todos as Logs de clientes');
  }, [setPageInfo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const queryParams = useMemo((): GetLogsParams & { userName?: string } => {
    const params: GetLogsParams & { userName?: string } = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) {
      params.activityType = searchTerm;
      params.module = searchTerm;
      params.userName = searchTerm;
    }

    if (selectedDate) {
      params.startDate = DateHelper.extractDateOnly(selectedDate);
      params.endDate = DateHelper.extractDateOnly(selectedDate);
    }
    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetLogs(queryParams, {});

  const logsResponse = rawData as unknown as ApiLogsResponse | undefined;

  const logs: Log[] = useMemo(() => {
    if (!logsResponse?.data) return [];
    return logsResponse.data.map(mapApiLogToLog);
  }, [logsResponse]);

  const sortedData = useMemo(() => {
    if (!sortField || sortField !== 'date' || !sortDirection) {
      return logs;
    }

    const logsWithDate = logs.map((log) => {
      const apiLog = logsResponse?.data.find((l) => String(l.id) === log.id);
      const createdAt = apiLog?.createdAt ? new Date(apiLog.createdAt) : new Date();
      return { ...log, createdAt };
    });

    const sorted = [...logsWithDate].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    });

    return sorted.map(({ createdAt: _createdAt, ...log }) => log);
  }, [logs, logsResponse, sortField, sortDirection]);

  const totalPages = logsResponse?.pagination?.totalPages || 1;

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

