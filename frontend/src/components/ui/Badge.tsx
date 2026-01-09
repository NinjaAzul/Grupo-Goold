import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary:
          'rounded-full px-2 lg:px-3 py-1 text-xs lg:text-sm',
        secondary:
          'rounded-[100px] border border-gray-300 px-[15px] py-[5px] text-xs font-medium leading-[150%] h-[28px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
};
