'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePage } from '@/contexts/PageContext';

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo(
      'Agendamentos',
      'Acompanhe todos os agendamentos de clientes de forma simples'
    );
  }, [setPageInfo]);

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="bg-background-white p-4 rounded-lg shadow-sm flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
        <div className="flex-1">
          <Input
            label="Filtre por nome"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome do cliente..."
          />
        </div>
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-primary mb-2">
            Selecione
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Todos</option>
            <option>Agendado</option>
            <option>Em análise</option>
            <option>Cancelado</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-500 hover:text-primary transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <div className="flex-1 lg:flex-initial">
            <Button variant="primary" className="w-full lg:w-auto">
              Ajustes de agendamento
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data agendamento
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sala de agendamento
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status transação
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Placeholder rows */}
            <tr>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-primary">
                22/01/2025 às 16:00
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-primary">
                    Camila Mendes
                  </div>
                  <div className="text-sm text-gray-500">Cliente</div>
                </div>
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                <span className="px-2 lg:px-3 py-1 bg-primary text-white rounded-full text-xs lg:text-sm font-medium">
                  Sala 012
                </span>
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                <span className="px-2 lg:px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs lg:text-sm">
                  Em análise
                </span>
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button className="text-success hover:text-success-dark">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button className="text-error hover:text-error-dark">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
          1
        </button>
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
          2
        </button>
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
          3
        </button>
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

