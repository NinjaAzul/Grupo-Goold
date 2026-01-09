'use client';

import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const timeInputVariants = cva(
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

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>,
    Omit<VariantProps<typeof timeInputVariants>, 'hasError' | 'hasLeftIcon' | 'hasRightIcon'> {
  label: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string; // Formato HH:mm
  onChange?: (value: string) => void;
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ label, error, required, className, leftIcon, rightIcon, value = '', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const formatTime = (input: string): string => {
      // Remove tudo que não é número
      const numbers = input.replace(/\D/g, '');
      
      if (numbers.length === 0) return '';
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 4) {
        return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
      }
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    };

    const validateTime = (time: string): boolean => {
      const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      return regex.test(time);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatTime(e.target.value);
      setDisplayValue(formatted);
      
      if (onChange) {
        if (formatted.length === 5 && validateTime(formatted)) {
          onChange(formatted);
        } else if (formatted.length === 0) {
          onChange('');
        }
      }
    };

    const handleBlur = () => {
      if (displayValue && !validateTime(displayValue)) {
        setDisplayValue('');
        if (onChange) onChange('');
      }
    };

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="HH:mm"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              timeInputVariants({
                hasError: !!error,
                hasLeftIcon: !!leftIcon,
                hasRightIcon: !!rightIcon,
              }),
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';

