import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  className?: string;
  color?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  color = '#D7D7D7',
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('h-full w-px', className)}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <div
      className={cn('w-full h-px', className)}
      style={{ backgroundColor: color }}
    />
  );
};

