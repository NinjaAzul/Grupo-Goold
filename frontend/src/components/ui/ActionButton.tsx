import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from '@/components/icons';

const actionButtonVariants = cva(
  'bg-primary text-white rounded-full flex items-center justify-center transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        check: 'w-8 h-8',
        close: 'w-8 h-8',
      },
    },
    defaultVariants: {
      variant: 'check',
    },
  }
);

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  variant: 'check' | 'close';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(actionButtonVariants({ variant }), className)}
      {...props}
    >
      {variant === 'check' ? (
        <CheckIcon className="w-4 h-3 text-white" />
      ) : (
        <XIcon className="w-3 h-3 text-white" />
      )}
    </button>
  );
};

