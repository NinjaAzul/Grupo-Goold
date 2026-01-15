'use client';

import { cn } from '@/lib/utils';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    />
  );
}

