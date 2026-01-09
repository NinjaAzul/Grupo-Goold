'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import DatePickerLib from 'react-datepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { registerLocale } from 'react-datepicker';
import { CalendarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

const datePickerButtonVariants = cva(
  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-left flex items-center justify-between',
  {
    variants: {
      hasError: {
        true: 'border-error',
        false: 'border-gray-300',
      },
      disabled: {
        true: 'bg-gray-100 cursor-not-allowed opacity-60',
        false: 'hover:border-gray-400',
      },
    },
    defaultVariants: {
      hasError: false,
      disabled: false,
    },
  }
);

export interface DatePickerProps
  extends Omit<VariantProps<typeof datePickerButtonVariants>, 'hasError' | 'disabled'> {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Selecione uma data',
  required = false,
  error,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = value ? format(value, 'dd/MM/yyyy', { locale: ptBR }) : '';

  const handleChange = (date: Date | null) => {
    onChange?.(date || undefined);
    setIsOpen(false);
  };

  const CustomInput = React.forwardRef<HTMLButtonElement>((props, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
          // @ts-ignore
          props.onClick?.();
        }}
        disabled={disabled}
        className={cn(
          datePickerButtonVariants({
            hasError: !!error,
            disabled: disabled,
          })
        )}
      >
        <span className={cn(displayValue ? 'text-primary' : 'text-gray-400', 'flex-1')}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-black flex-shrink-0 ml-3" />
      </button>
    );
  });

  CustomInput.displayName = 'CustomInput';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <DatePickerLib
          selected={value || null}
          onChange={handleChange}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder}
          disabled={disabled}
          open={isOpen}
          onSelect={() => setIsOpen(false)}
          onClickOutside={() => setIsOpen(false)}
          customInput={<CustomInput />}
          popperClassName="!z-[100]"
          popperPlacement="bottom-start"
        />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};
