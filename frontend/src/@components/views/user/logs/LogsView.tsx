'use client';

import { useState, useEffect, useMemo } from 'react';
import { Divider } from '@/@components/ui/Divider';
import { Pagination } from '@/@components/ui/Pagination';
import { usePage } from '@/contexts/PageContext';
import { LogsFilters } from './LogsFilters';
import { LogsTable } from './LogsTable';
import { useGetLogsMe } from '@/api/generated/logs/logs';
import { GetLogsMeParams } from '@/api/generated/models';
import { Log, SortField, SortDirection, ApiLogsResponse, ApiLog } from './types';
import { sortLogs } from './utils';
import { DateHelper } from '@/lib/date';

const mapApiLogToLog = (apiLog: ApiLog): Log => {
  const createdAt = apiLog.createdAt
    ? DateHelper.fromISOString(apiLog.createdAt)
    : new Date();

  return {
    id: String(apiLog.id),
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
    setPageInfo('Logs', 'Acompanhe todos as suas Logs');
  }, [setPageInfo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const queryParams = useMemo((): GetLogsMeParams => {
    const params: GetLogsMeParams = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) {
      params.activityType = searchTerm;
      params.module = searchTerm;
    }

    if (selectedDate) {
      params.startDate = DateHelper.extractDateOnly(selectedDate);
      params.endDate = DateHelper.extractDateOnly(selectedDate);
    }

    return params;
  }, [currentPage, searchTerm, selectedDate]);

  const { data: rawData, isLoading } = useGetLogsMe(queryParams, {});

  const logsResponse = rawData as unknown as ApiLogsResponse | undefined;

  const logs: Log[] = useMemo(() => {
    if (!logsResponse?.data) return [];
    return logsResponse.data.map(mapApiLogToLog);
  }, [logsResponse]);

  const sortedData = useMemo(() => {
    return sortLogs(logs, sortField, sortDirection);
  }, [logs, sortField, sortDirection]);

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

