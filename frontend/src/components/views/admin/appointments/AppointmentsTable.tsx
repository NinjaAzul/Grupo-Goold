'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Agendamento, SortField, SortDirection } from './types';

interface AppointmentsTableProps {
  data: Agendamento[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onApprove?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentsTable({
  data,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onApprove,
  onCancel,
}: AppointmentsTableProps) {
  return (
    <div className="bg-background-white overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={sortField === 'data' ? sortDirection : null}
                onSort={() => onSort('data')}
              >
                Data agendamento
              </TableHead>
              <TableHead
                sortable
                sortDirection={sortField === 'nome' ? sortDirection : null}
                onSort={() => onSort('nome')}
              >
                Nome
              </TableHead>
              <TableHead>Sala de agendamento</TableHead>
              <TableHead>Status transação</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton variant="text" className="w-32" />
                  </TableCell>
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
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton variant="button" />
                      <Skeleton variant="button" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data.map((agendamento) => (
                <TableRow key={agendamento.id} variant={agendamento.status}>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {agendamento.data}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {agendamento.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {agendamento.tipo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="primary" className="bg-primary text-white">
                      {agendamento.sala}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={
                        agendamento.status === 'agendado'
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : agendamento.status === 'cancelado'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }
                    >
                      {agendamento.status === 'agendado'
                        ? 'Agendado'
                        : agendamento.status === 'cancelado'
                        ? 'Cancelado'
                        : 'Em análise'}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm font-medium text-right">
                    {agendamento.status !== 'cancelado' && (
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          variant="check"
                          onClick={() => onApprove?.(agendamento.id)}
                          aria-label="Aprovar agendamento"
                        />
                        <ActionButton
                          variant="close"
                          onClick={() => onCancel?.(agendamento.id)}
                          aria-label="Cancelar agendamento"
                        />
                      </div>
                    )}
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

