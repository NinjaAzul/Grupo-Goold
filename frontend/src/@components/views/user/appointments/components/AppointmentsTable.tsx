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
import { ActionButton } from '@/@components/ui/ActionButton';
import { Skeleton } from '@/@components/ui/Skeleton';
import { NotFound } from '@/@components/ui/NotFound';
import { Appointment, SortField, SortDirection } from '../shared/types';

interface AppointmentsTableProps {
  data: Appointment[];
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
  const getStatusBadgeColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'cancelled':
        return 'Cancelado';
      case 'pending':
        return 'Em análise';
      default:
        return status;
    }
  };

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
              <TableHead
                sortable
                sortDirection={sortField === 'date' ? sortDirection : null}
                onSort={() => onSort('date')}
              >
                Data agendamento
              </TableHead>
              <TableHead
                sortable
                sortDirection={sortField === 'name' ? sortDirection : null}
                onSort={() => onSort('name')}
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
                    <Skeleton variant="badge" className="w-8 h-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data.map((appointment) => {
                const getStatusRowClassName = (status: Appointment['status']): string => {
                  const baseClasses = 'border-b transition-colors';
                  switch (status) {
                    case 'scheduled':
                      return `${baseClasses} bg-green-50 hover:bg-green-100/50`;
                    case 'cancelled':
                      return `${baseClasses} bg-red-50 hover:bg-red-100/50`;
                    case 'pending':
                      return `${baseClasses} bg-white hover:bg-gray-50/50`;
                    default:
                      return `${baseClasses} bg-white hover:bg-gray-50/50`;
                  }
                };
                return (
                <TableRow key={appointment.id} className={getStatusRowClassName(appointment.status)}>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {appointment.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {appointment.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="bg-black text-white border-black">
                      {appointment.room}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={getStatusBadgeColor(appointment.status)}
                    >
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {(() => {
                      switch (appointment.status) {
                        case 'scheduled':
                        case 'pending':
                          return onCancel ? (
                            <ActionButton
                              variant="close"
                              onClick={() => onCancel(appointment.id)}
                              aria-label="Cancelar agendamento"
                            />
                          ) : null;
                        case 'cancelled':
                          return null;
                        default:
                          return null;
                      }
                    })()}
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

