'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/@components/ui/Table';
import { Badge } from '@/@components/ui/Badge';
import { Skeleton } from '@/@components/ui/Skeleton';
import { NotFound } from '@/@components/ui/NotFound';
import { UserIcon, CalendarIcon } from '@/@components/icons';
import { Log, SortField, SortDirection } from './types';

interface LogsTableProps {
  data: Log[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function LogsTable({
  data,
  isLoading,
  sortField,
  sortDirection,
  onSort,
}: LogsTableProps) {
  if (!isLoading && data.length === 0) {
    return (
      <div className="bg-background-white mt-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-white mt-4">
      <div className="overflow-x-auto -mx-4 lg:-mx-8 px-4 lg:px-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo de atividade</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead
                sortable
                sortDirection={sortField === 'date' ? sortDirection : null}
                onSort={() => onSort('date')}
              >
                Data e horário
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">
                    <div className="space-y-2">
                      <Skeleton variant="text" className="w-24" />
                      <Skeleton variant="text" className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton variant="badge" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton variant="badge" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton variant="text" className="w-32" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {log.clientName}
                      </div>
                      <div className="text-sm text-gray-500">{log.clientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="bg-background text-black border-border">
                      {log.activityType}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="bg-background text-black border-border inline-flex items-center gap-1 w-auto">
                      {log.module === 'Minha Conta' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : log.module === 'Agendamento' ? (
                        <CalendarIcon className="w-4 h-4" />
                      ) : null}
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {log.dateTime}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

