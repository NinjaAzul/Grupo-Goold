import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse rounded', {
  variants: {
    variant: {
      text: 'h-4 bg-gray-200',
      badge: 'h-6 w-20 bg-gray-200',
      button: 'h-8 w-8 rounded-full bg-gray-200',
      cell: 'h-12 bg-gray-200',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
};

