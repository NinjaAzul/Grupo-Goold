import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SortIcon } from '@/components/icons';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b bg-gray-50', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0 bg-white divide-y divide-gray-200', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-gray-50/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const tableRowVariants = cva(
  'border-b transition-colors data-[state=selected]:bg-gray-50',
  {
    variants: {
      variant: {
        default: 'bg-white hover:bg-gray-50/50',
        agendado: 'bg-green-50 hover:bg-green-100/50',
        cancelado: 'bg-red-50 hover:bg-red-100/50',
        em_analise: 'bg-white hover:bg-gray-50/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const tableHeadVariants = cva(
  'h-12 px-4 lg:px-6 text-left align-middle font-medium text-xs text-black uppercase tracking-wider [&:has([role=checkbox])]:pr-0',
  {
    variants: {
      sortable: {
        true: 'cursor-pointer select-none hover:bg-gray-100',
        false: '',
      },
    },
    defaultVariants: {
      sortable: false,
    },
  }
);

const sortIconVariants = cva('w-4 h-4', {
  variants: {
    isActive: {
      true: 'text-black',
      false: 'text-gray-400',
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export interface TableHeadProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => {
    const isSortActive = sortDirection === 'asc' || sortDirection === 'desc';

    return (
      <th
        ref={ref}
        className={cn(tableHeadVariants({ sortable: !!sortable }), className)}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        {sortable ? (
          <div className="flex items-center gap-2">
            {children}
            <SortIcon
              className={cn(sortIconVariants({ isActive: isSortActive }))}
            />
          </div>
        ) : (
          children
        )}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 lg:p-6 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-gray-500', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

