'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/@components/ui/table';
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
  return (
    <div className="bg-background-white mt-4">
      <div className="overflow-x-auto -mx-4 lg:-mx-8 px-4 lg:px-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de atividade</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead
                sortable
                sortDirection={sortField === 'data' ? sortDirection : null}
                onSort={() => onSort('data')}
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
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="p-0">
                  <NotFound />
                </TableCell>
              </TableRow>
            ) : (
              data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="bg-background text-black border-border">
                      {log.tipoAtividade}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="bg-background text-black border-border inline-flex items-center gap-1 w-auto">
                      {log.modulo === 'Minha Conta' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : log.modulo === 'Agendamento' ? (
                        <CalendarIcon className="w-4 h-4" />
                      ) : null}
                      {log.modulo}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {log.dataHorario}
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

