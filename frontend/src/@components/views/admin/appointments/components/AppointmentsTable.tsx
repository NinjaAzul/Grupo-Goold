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
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton variant="button" />
                      <Skeleton variant="button" />
                    </div>
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
                    <Badge variant="primary" className="bg-primary text-white">
                      {appointment.room}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {(() => {
                      const getStatusBadgeProps = (status: Appointment['status']) => {
                        switch (status) {
                          case 'scheduled':
                            return {
                              className: 'bg-green-100 text-green-700 border-green-300',
                              label: 'Agendado',
                            };
                          case 'cancelled':
                            return {
                              className: 'bg-red-100 text-red-700 border-red-300',
                              label: 'Cancelado',
                            };
                          case 'pending':
                            return {
                              className: 'bg-gray-200 text-gray-700 border-gray-300',
                              label: 'Em análise',
                            };
                          default:
                            return {
                              className: 'bg-gray-200 text-gray-700 border-gray-300',
                              label: 'Em análise',
                            };
                        }
                      };
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
                        case 'pending':
                          return (
                            <div className="flex items-center justify-end gap-2">
                              <ActionButton
                                variant="check"
                                onClick={() => onApprove?.(appointment.id)}
                                aria-label="Aprovar agendamento"
                              />
                              <ActionButton
                                variant="close"
                                onClick={() => onCancel?.(appointment.id)}
                                aria-label="Cancelar agendamento"
                              />
                            </div>
                          );
                        case 'scheduled':
                          return (
                            <div className="flex items-center justify-end gap-2">
                              <ActionButton
                                variant="close"
                                onClick={() => onCancel?.(appointment.id)}
                                aria-label="Cancelar agendamento"
                              />
                            </div>
                          );
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

