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
import { Switch } from '@/@components/ui/Switch';
import { Skeleton } from '@/@components/ui/Skeleton';
import { NotFound } from '@/@components/ui/NotFound';
import { cn } from '@/lib/utils';
import { Cliente, SortField, SortDirection } from './types';

interface ClientsTableProps {
  data: Cliente[];
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
  return (
    <div className="bg-background-white mt-4">
      <div className="overflow-x-auto -mx-4 lg:-mx-8 px-4 lg:px-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={sortField === 'dataCadastro' ? sortDirection : null}
                onSort={() => onSort('dataCadastro')}
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
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <NotFound />
                </TableCell>
              </TableRow>
            ) : (
              data.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {cliente.dataCadastro}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {cliente.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cliente.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-primary">
                    {cliente.endereco}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      {cliente.permissoes.map((permissao) => (
                        <Badge
                          key={permissao.id}
                          variant="primary"
                          textColor={permissao.granted ? '#FFFFFF' : '#000000'}
                          backgroundColor={permissao.granted ? '#000000' : '#FFFFFF'}
                          className={cn(
                            'cursor-pointer border border-black',
                            !permissao.granted && 'transition-colors'
                          )}
                          onMouseEnter={(e) => {
                            if (!permissao.granted) {
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!permissao.granted) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                            }
                          }}
                          onClick={() => onTogglePermission?.(cliente.id, permissao.id, !permissao.granted)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onTogglePermission?.(cliente.id, permissao.id, !permissao.granted);
                            }
                          }}
                        >
                          {permissao.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Switch
                      checked={cliente.status}
                      onChange={(checked) => onToggleStatus?.(cliente.id, checked)}
                      aria-label={`${cliente.status ? 'Desativar' : 'Ativar'} cliente ${cliente.nome}`}
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

