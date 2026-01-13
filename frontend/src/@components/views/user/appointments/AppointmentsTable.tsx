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
import { ActionButton } from '@/@components/ui/ActionButton';
import { Skeleton } from '@/@components/ui/Skeleton';
import { NotFound } from '@/@components/ui/NotFound';
import { XIcon } from '@/@components/icons';
import { Agendamento, SortField, SortDirection } from './types';

interface AppointmentsTableProps {
  data: Agendamento[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentsTable({
  data,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onCancel,
}: AppointmentsTableProps) {
  const getStatusBadgeColor = (status: Agendamento['status']) => {
    switch (status) {
      case 'agendado':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'em_analise':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: Agendamento['status']) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'cancelado':
        return 'Cancelado';
      case 'em_analise':
        return 'Em análise';
      default:
        return status;
    }
  };

  return (
    <div className="bg-background-white mt-4">
      <div className="overflow-x-auto -mx-4 lg:-mx-8 px-4 lg:px-8">
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
              <TableHead>Nome</TableHead>
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
                    <Skeleton variant="badge" className="w-8 h-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <NotFound />
                </TableCell>
              </TableRow>
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
                    <Badge variant="secondary" className="bg-black text-white border-black">
                      {agendamento.sala}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={getStatusBadgeColor(agendamento.status)}
                    >
                      {getStatusLabel(agendamento.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {agendamento.status !== 'cancelado' && onCancel && (
                      <ActionButton
                        icon={<XIcon className="w-4 h-4" />}
                        onClick={() => onCancel(agendamento.id)}
                        variant="error"
                        aria-label="Cancelar agendamento"
                      />
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

