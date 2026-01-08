import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
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

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'hasError'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={cn(inputVariants({ hasError: !!error }), className)}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

