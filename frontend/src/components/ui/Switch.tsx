'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary border-2',
  {
    variants: {
      checked: {
        true: 'bg-primary border-primary',
        false: 'bg-gray-200 border-gray-300',
      },
      size: {
        default: 'h-6 w-11',
        sm: 'h-5 w-9',
      },
    },
    defaultVariants: {
      checked: false,
      size: 'default',
    },
  }
);

const switchThumbVariants = cva(
  'inline-block rounded-full bg-white transform transition-transform',
  {
    variants: {
      checked: {
        true: 'translate-x-5',
        false: 'translate-x-0.5',
      },
      size: {
        default: 'h-4 w-4',
        sm: 'h-3.5 w-3.5',
      },
    },
    defaultVariants: {
      checked: false,
      size: 'default',
    },
  }
);

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  size,
  className,
  disabled,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={cn(switchVariants({ checked, size }), className)}
      {...props}
    >
      <span className={cn(switchThumbVariants({ checked, size }))} />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </button>
  );
};

Switch.displayName = 'Switch';

