'use client';

import React, { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ClockIcon, CheckIcon } from '@/@components/icons';

const selectTriggerVariants = cva(
  'w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer flex items-center justify-between',
  {
    variants: {
      hasError: {
        true: 'border-error',
        false: 'border-gray-300',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      hasError: false,
      disabled: false,
    },
  }
);

const selectContentVariants = cva(
  'overflow-hidden bg-white rounded-lg border border-gray-200 shadow-lg z-50',
  {
    variants: {
      position: {
        popper: 'min-w-[var(--radix-select-trigger-width)]',
        'item-aligned': '',
      },
    },
  }
);

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends Omit<VariantProps<typeof selectTriggerVariants>, 'hasError' | 'disabled'> {
  label?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  disabled?: boolean;
  type?: 'default' | 'hour';
  className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      required,
      className,
      options,
      placeholder,
      value,
      onChange,
      disabled,
      type = 'default',
      ...props
    },
    ref
  ) => {
    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    const displayValue = selectedOption?.label || placeholder || '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary mb-2">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <SelectPrimitive.Root
          value={value !== undefined && value !== null ? String(value) : undefined}
          onValueChange={(newValue) => {
            if (newValue) {
              const option = options.find((opt) => String(opt.value) === newValue);
              if (option && onChange) {
                onChange(option.value);
              }
            } else if (onChange) {
              onChange(undefined);
            }
          }}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              selectTriggerVariants({
                hasError: !!error,
                disabled: !!disabled,
              }),
              className
            )}
            {...props}
          >
            <SelectPrimitive.Value placeholder={placeholder}>
              {displayValue}
            </SelectPrimitive.Value>
            <SelectPrimitive.Icon className="ml-2">
              {type === 'hour' ? (
                <ClockIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              )}
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(selectContentVariants({ position: 'popper' }))}
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={String(option.value)}
                    className={cn(
                      'relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer',
                      'focus:bg-gray-100 focus:outline-none',
                      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
                      'data-[highlighted]:bg-gray-100'
                    )}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-3">
                      <CheckIcon className="w-4 h-4 text-primary" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
