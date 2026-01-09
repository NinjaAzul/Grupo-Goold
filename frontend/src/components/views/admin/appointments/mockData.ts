import { Agendamento } from './types';

export const mockData: Agendamento[] = [
  {
    id: '1',
    data: '22/01/2025 às 14:00',
    nome: 'Joana Barbosa',
    tipo: 'Cliente',
    sala: 'Sala 012',
    status: 'agendado',
  },
  {
    id: '2',
    data: '22/01/2025 às 13:00',
    nome: 'Lucas Coutinho',
    tipo: 'Cliente',
    sala: 'Sala 012',
    status: 'agendado',
  },
  {
    id: '3',
    data: '22/01/2025 às 12:00',
    nome: 'Lucas Coutinho',
    tipo: 'Cliente',
    sala: 'Sala 012',
    status: 'cancelado',
  },
  {
    id: '4',
    data: '22/01/2025 às 12:00',
    nome: 'Camila Mendes',
    tipo: 'Cliente',
    sala: 'Sala 012',
    status: 'cancelado',
  },
  {
    id: '5',
    data: '22/01/2025 às 16:00',
    nome: 'Camila Mendes',
    tipo: 'Cliente',
    sala: 'Sala 012',
    status: 'em_analise',
  },
];

