'use client';

import React, { useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { XIcon } from '@/components/icons'; 

const modalOverlayVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity',
  {
    variants: {
      isOpen: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

const modalContentVariants = cva(
  'bg-background-white rounded-[5px] shadow-lg transition-all w-full max-h-[90vh] flex flex-col border border-[#D7D7D7]',
  {
    variants: {
      size: {
        xs: 'w-[375px] h-[500px]',
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-none max-h-[calc(100vh-2rem)]',
      },
      isOpen: {
        true: 'scale-100 opacity-100',
        false: 'scale-95 opacity-0',
      },
    },
    defaultVariants: {
      size: 'xs',
      isOpen: false,
    },
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size,
  showCloseButton = true,
  className,
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(modalOverlayVariants({ isOpen }))}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(modalContentVariants({ size, isOpen }), className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className="flex items-center justify-between p-6 border-b border-[#D7D7D7] flex-shrink-0"
            style={{ borderBottomColor: '#D7D7D7' }}
          >
            <div className="flex items-center gap-2">
              {title && (
                <h2 id="modal-title" className="text-xl font-bold text-primary">
                  {title}
                </h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-black hover:text-black transition-colors"
                aria-label="Fechar modal"
              >
                <XIcon className="w-[12.72px] h-[12.74px]" strokeWidth={0.5} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

