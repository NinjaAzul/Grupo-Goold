import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SpinnerIcon } from '@/components/icons';

const buttonVariants = cva(
  'px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-gray-800 focus:ring-primary',
        secondary: 'bg-gray-200 text-primary hover:bg-gray-300 focus:ring-gray-400',
        error: 'bg-error/80 text-white hover:bg-red-600 focus:ring-error',
        success: 'bg-success text-white hover:bg-teal-600 focus:ring-success',
        link: 'bg-transparent text-black hover:bg-transparent hover:text-black p-0 focus:ring-transparent shadow-none font-medium text-base leading-[165%] tracking-[0.5%]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <SpinnerIcon />
        </span>
      ) : (
        children
      )}
    </button>
  );
};

