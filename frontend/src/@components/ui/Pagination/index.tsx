import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@/@components/icons';

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

    const getPageNumbers = (): (number | 'ellipsis')[] => {
      const maxVisible = 7;
      const pages: (number | 'ellipsis')[] = [];

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage <= 4) {
          for (let i = 2; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('ellipsis');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push('ellipsis');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push('ellipsis');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

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
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-primary opacity-50 px-1"
                >
                  ...
                </span>
              );
            }

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

