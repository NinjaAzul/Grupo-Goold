'use client';

import { MenuIcon, LogoIcon } from '@/@components/icons';

interface HeaderMobileProps {
  onMenuClick: () => void;
}

export function HeaderMobile({ onMenuClick }: HeaderMobileProps) {
  return (
    <div className="lg:hidden bg-background-white p-4 flex items-center gap-4 border-b border-border">
      <button
        onClick={onMenuClick}
        className="text-gray-700 hover:text-primary transition-colors"
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </button>
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <LogoIcon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}

