import React, { FormHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
  return (
    <form
      className={cn(
        'bg-background-white p-6 sm:p-8 rounded-lg border border-border w-full',
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
};

Form.displayName = 'Form';

