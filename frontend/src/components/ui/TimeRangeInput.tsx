'use client';

import React, { InputHTMLAttributes, forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import InputMask from 'react-input-mask';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ClockIcon } from '@/components/icons';

const timeRangeInputVariants = cva(
  'w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
  {
    variants: {
      hasError: {
        true: 'border-error',
        false: 'border-gray-300',
      },
      hasRightIcon: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      hasError: false,
      hasRightIcon: false,
    },
  }
);

export interface TimeRangeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>,
    Omit<VariantProps<typeof timeRangeInputVariants>, 'hasError' | 'hasRightIcon'> {
  label: string;
  error?: string;
  required?: boolean;
  startTime?: string; // Formato HH:mm
  endTime?: string; // Formato HH:mm
  onChange?: (startTime: string, endTime: string) => void;
}

export const TimeRangeInput = forwardRef<HTMLInputElement, TimeRangeInputProps>(
  (
    {
      label,
      error,
      required,
      className,
      startTime = '',
      endTime = '',
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = useState(
      startTime && endTime ? `${startTime} - ${endTime}` : ''
    );

    // Expor o input interno através do ref externo
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    useEffect(() => {
      if (startTime && endTime) {
        setDisplayValue(`${startTime} - ${endTime}`);
      } else {
        setDisplayValue('');
      }
    }, [startTime, endTime]);

    const validateTime = (time: string): boolean => {
      const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      return regex.test(time);
    };

    const parseTimeRange = (value: string): { start: string; end: string } => {
      const parts = value.split(' - ').map((p) => p.trim());
      return {
        start: parts[0] || '',
        end: parts[1] || '',
      };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const previousValue = displayValue;
      setDisplayValue(newValue);

      const separatorIndex = newValue.indexOf(' - ');
      const firstTimeComplete = separatorIndex === 5;
      const hadSeparator = previousValue.includes(' - ');

      
      if (firstTimeComplete && !hadSeparator) {
        setTimeout(() => {
          const input = inputRef.current;
          if (input) {
       
            const cursorPos = separatorIndex + 3;
            input.setSelectionRange(cursorPos, cursorPos);
          }
        }, 0);
      }

      if (onChange) {
        const { start, end } = parseTimeRange(newValue);
        if (start && end && validateTime(start) && validateTime(end)) {
          onChange(start, end);
        } else if (newValue.length === 0) {
          onChange('', '');
        }
      }
    };

    const handleBlur = () => {
      const { start, end } = parseTimeRange(displayValue);
      if (displayValue && (!validateTime(start) || !validateTime(end))) {
        setDisplayValue('');
        if (onChange) onChange('', '');
      }
    };

    // Máscara: HH:mm - HH:mm
    // 99:99 - 99:99 onde 9 é dígito
    const mask = '99:99 - 99:99';

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative">
          <InputMask
            mask={mask}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            maskChar={null}
            alwaysShowMask={false}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="HH:mm - HH:mm"
                className={cn(
                  timeRangeInputVariants({
                    hasError: !!error,
                    hasRightIcon: true,
                  }),
                  'px-4',
                  className
                )}
                {...props}
              />
            )}
          </InputMask>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ClockIcon className="w-5 h-5 text-black" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

TimeRangeInput.displayName = 'TimeRangeInput';
