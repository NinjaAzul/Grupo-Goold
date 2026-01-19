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
  const getStatusBadgeProps = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return {
          className: 'bg-success-light text-success border-success',
          label: 'Agendado',
        };
      case 'cancelled':
        return {
          className: 'bg-error-light text-error border-error',
          label: 'Cancelado',
        };
      case 'pending':
        return {
          className: 'bg-pending-light text-pending-text border-pending-border text-xs font-medium leading-[150%] tracking-[0px]',
          label: 'Em análise',
        };
      default:
        return {
          className: 'bg-pending-light text-pending-text border-pending-border text-xs font-medium leading-[150%] tracking-[0px]',
          label: 'Em análise',
        };
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
                      return `${baseClasses} bg-success-light`;
                    case 'cancelled':
                      return `${baseClasses} bg-error-light`;
                    case 'pending':
                      return `${baseClasses} bg-pending-white`;
                    default:
                      return `${baseClasses} bg-pending-white`; 
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
                    <Badge variant="primary" className="bg-primary text-white">
                      {appointment.room}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {(() => {
                      const badgeProps = getStatusBadgeProps(appointment.status);
                      return (
                        <Badge variant="secondary" className={badgeProps.className}>
                          {badgeProps.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm font-medium text-right">
                    {(() => {
                      switch (appointment.status) {
                        case 'scheduled':
                        case 'pending':
                          return onCancel ? (
                            <div className="flex items-center justify-end gap-2">
                              <ActionButton
                                variant="close"
                                onClick={() => onCancel(appointment.id)}
                                aria-label="Cancelar agendamento"
                              />
                            </div>
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

