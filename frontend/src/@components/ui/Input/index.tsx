import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SpinnerIcon } from '@/@components/icons';

const inputVariants = cva(
  'w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
  {
    variants: {
      hasError: {
        true: 'border-error',
        false: 'border-gray-300',
      },
      hasLeftIcon: {
        true: 'pl-10',
        false: 'px-4',
      },
      hasRightIcon: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      hasError: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'hasError' | 'hasLeftIcon' | 'hasRightIcon'> {
  label?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, leftIcon, rightIcon, isLoading, ...props }, ref) => {
    const showRightIcon = isLoading ? <SpinnerIcon className="w-5 h-5" /> : rightIcon;
    const hasRightIcon = !!showRightIcon;

    return (
      <div className="w-full min-w-0">
        {label && (
          <label className="block text-sm font-medium text-primary mb-2 break-words">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              inputVariants({
                hasError: !!error,
                hasLeftIcon: !!leftIcon,
                hasRightIcon,
              }),
              className
            )}
            disabled={isLoading || props.disabled}
            {...props}
          />
          {showRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {showRightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
