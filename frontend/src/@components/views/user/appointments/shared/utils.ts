import { Appointment, SortField, SortDirection } from './types';
import { DateHelper } from '@/lib/date';

export const sortAppointments = (
  appointments: Appointment[],
  sortField: SortField,
  sortDirection: SortDirection
): Appointment[] => {
  if (!sortField || !sortDirection) return appointments;

  return [...appointments].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = DateHelper.parseFormattedDate(a.date);
      const dateB = DateHelper.parseFormattedDate(b.date);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    if (sortField === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    }

    return 0;
  });
};

