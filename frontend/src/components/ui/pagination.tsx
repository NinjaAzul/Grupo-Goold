import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

const paginationButtonVariants = cva(
  'bg-primary text-white rounded-[4px] font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
  {
    variants: {
      variant: {
        nav: 'w-[18px] h-[18px]',
        page: 'w-[26px] h-[26px] text-sm',
      },
    },
    defaultVariants: {
      variant: 'page',
    },
  }
);

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, ...props }, ref) => {
    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };

    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };

    const handlePageClick = (page: number) => {
      onPageChange(page);
    };

    return (
      <div
        ref={ref}
        className={cn('flex justify-center items-center gap-[10px]', className)}
        {...props}
      >
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={cn(paginationButtonVariants({ variant: 'nav' }))}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="w-2 h-2 text-white" />
        </button>

        <div className="flex items-center gap-[10px]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={cn(
                  paginationButtonVariants({ variant: 'page' }),
                  !isActive && 'opacity-50'
                )}
                aria-label={`Página ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={cn(paginationButtonVariants({ variant: 'nav' }))}
          aria-label="Próxima página"
        >
          <ChevronRightIcon className="w-2 h-2 text-white" />
        </button>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

