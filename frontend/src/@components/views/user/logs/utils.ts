import { Log, SortField, SortDirection } from './types';
import { DateHelper } from '@/lib/date';

export const sortLogs = (
  logs: Log[],
  sortField: SortField,
  sortDirection: SortDirection
): Log[] => {
  if (!sortField || !sortDirection) return logs;

  return [...logs].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = DateHelper.parseFormattedDate(a.dateTime);
      const dateB = DateHelper.parseFormattedDate(b.dateTime);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
};

