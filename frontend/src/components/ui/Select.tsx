import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@/components/icons';

const selectVariants = cva(
  'w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none cursor-pointer',
  {
    variants: {
      hasError: {
        true: 'border-error',
        false: 'border-gray-300',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof selectVariants>, 'hasError'> {
  label: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, className, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              selectVariants({
                hasError: !!error,
              }),
              'px-4 pr-10',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5" stroke="#737373" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

