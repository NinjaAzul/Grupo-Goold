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
import { Switch } from '@/@components/ui/Switch';
import { Skeleton } from '@/@components/ui/Skeleton';
import { NotFound } from '@/@components/ui/NotFound';
import { cn } from '@/lib/utils';
import { Client, SortField, SortDirection } from './types';

interface ClientsTableProps {
  data: Client[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onToggleStatus?: (id: string, status: boolean) => void;
  onTogglePermission?: (userId: string, permissionId: number, granted: boolean) => void;
}


export function ClientsTable({
  data,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onToggleStatus,
  onTogglePermission,
}: ClientsTableProps) {
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
                sortDirection={sortField === 'registrationDate' ? sortDirection : null}
                onSort={() => onSort('registrationDate')}
              >
                Data de cadastro
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Status</TableHead>
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
                    <Skeleton variant="text" className="w-48" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2">
                      <Skeleton variant="badge" />
                      <Skeleton variant="badge" />
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton variant="button" className="w-11 h-6" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {client.registrationDate}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {client.address}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      {client.permissions.map((permission) => (
                        <Badge
                          key={permission.id}
                          variant="primary"
                          textColor={permission.granted ? '#FFFFFF' : '#000000'}
                          backgroundColor={permission.granted ? '#000000' : '#FFFFFF'}
                          className={cn(
                            'cursor-pointer border border-black',
                            !permission.granted && 'transition-colors'
                          )}
                          onMouseEnter={(e) => {
                            if (!permission.granted) {
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!permission.granted) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                            }
                          }}
                          onClick={() => onTogglePermission?.(client.id, permission.id, !permission.granted)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onTogglePermission?.(client.id, permission.id, !permission.granted);
                            }
                          }}
                        >
                          {permission.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Switch
                      checked={client.status}
                      onChange={(checked) => onToggleStatus?.(client.id, checked)}
                      aria-label={`${client.status ? 'Desativar' : 'Ativar'} cliente ${client.name}`}
                    />
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

