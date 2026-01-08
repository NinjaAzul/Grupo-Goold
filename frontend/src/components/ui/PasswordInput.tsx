'use client';

import React, { InputHTMLAttributes, useState, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from '@/components/icons';

const passwordInputVariants = cva(
  'w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
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

const toggleButtonVariants = cva(
  'absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
  {
    variants: {
      variant: {
        default: 'text-gray-500 hover:text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
    Omit<VariantProps<typeof passwordInputVariants>, 'hasError'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(passwordInputVariants({ hasError: !!error }), className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(toggleButtonVariants())}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ?   <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

