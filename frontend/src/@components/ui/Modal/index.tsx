'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { XIcon } from '@/@components/icons';

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
  'bg-background-white rounded-[5px] shadow-lg transition-all w-full max-h-[90vh] flex flex-col border border-border',
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

interface ModalContextType {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within Modal');
  }
  return context;
};

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const ModalRoot: React.FC<ModalProps> = ({
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

  const contextValue: ModalContextType = { onClose };

  const childrenArray = React.Children.toArray(children);
  const hasCustomHeader = childrenArray.some(
    (child) => React.isValidElement(child) && (child.type as any)?.displayName === 'Modal.Header'
  );
  const hasCustomFooter = childrenArray.some(
    (child) => React.isValidElement(child) && (child.type as any)?.displayName === 'Modal.Footer'
  );
  const hasCustomBody = childrenArray.some(
    (child) => React.isValidElement(child) && (child.type as any)?.displayName === 'Modal.Body'
  );

  if (hasCustomHeader || hasCustomFooter || hasCustomBody) {
    return (
      <ModalContext.Provider value={contextValue}>
        <div
          className={cn(modalOverlayVariants({ isOpen }))}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={cn(modalContentVariants({ size, isOpen }), className)}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>
    );
  }

  return (
    <ModalContext.Provider value={contextValue}>
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
          {(title || showCloseButton) && (
            <div
              className="flex items-center justify-between p-6 flex-shrink-0"
              style={{ borderBottom: '1px solid #D7D7D7' }}
            >
              <div className="flex items-center gap-2">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-[18px] font-medium text-primary leading-none tracking-normal"
            
                  >
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
                  <XIcon
                    className="w-[12.72px] h-[12.74px]"
                    style={{ width: '12.719970703125px', height: '12.735342025756836px' }}
                    strokeWidth={0.5}
                  />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & { title?: string }> = ({
  title,
  children,
  className,
  ...props
}) => {
  const { onClose } = useModalContext();

  return (
    <div
      className={cn('flex items-center justify-between p-6 flex-shrink-0', className)}
      style={{ borderBottom: '1px solid #D7D7D7' }}
      {...props}
    >
      <div className="flex items-center gap-2">
        {title && (
          <h2
            id="modal-title"
            className="text-[18px] font-medium text-primary leading-none tracking-normal"
            style={{ fontFamily: 'Montserrat' }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
      <button
        onClick={onClose}
        className="text-black hover:text-black transition-colors"
        aria-label="Fechar modal"
      >
        <XIcon
          className="w-[12.72px] h-[12.74px]"
          style={{ width: '12.719970703125px', height: '12.735342025756836px' }}
          strokeWidth={0.5}
        />
      </button>
    </div>
  );
};
ModalHeader.displayName = 'Modal.Header';

const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex-1 overflow-y-auto p-6', className)} {...props}>
      {children}
    </div>
  );
};
ModalBody.displayName = 'Modal.Body';

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-full h-[90px] border-t border-[#D7D7D7] shadow-[0px_0px_13px_0px_rgba(0,0,0,0.15)]',
        className
      )}
      {...props}
    >
      <div className="h-full flex items-center gap-3 px-6 w-full">
        {children}
      </div>
    </div>
  );
};
ModalFooter.displayName = 'Modal.Footer';

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

Modal.displayName = 'Modal';
