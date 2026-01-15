'use client';

import { LogoIcon, XIcon } from '@/@components/icons';

interface SidebarLogoProps {
  onClose?: () => void;
}

export function SidebarLogo({ onClose }: SidebarLogoProps) {
  return (
    <div className="bg-background border-b border-border">
      <div className="p-6 flex items-center justify-between h-[96px]">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
          <LogoIcon className="w-8 h-8 text-white" />
        </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-primary hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <XIcon className="w-6 h-6" />
            </button>
          )}
      </div>
    </div>
  );
}

