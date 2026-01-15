'use client';

import { cn } from '@/lib/utils';
import { SidebarOverlay } from './SidebarOverlay';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNav, type NavItem } from './SidebarNav';
import { SidebarUserProfile } from './SidebarUserProfile';

interface SidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  userFirstName?: string;
  userLastName?: string;
  roleLabel: string;
  onLogout: () => void;
}

export function SidebarMobile({
  isOpen,
  onClose,
  navItems,
  userFirstName,
  userLastName,
  roleLabel,
  onLogout,
}: SidebarMobileProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose} />

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-background min-h-screen flex flex-col border-r border-sidebar transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64'
        )}
      >
        <SidebarLogo onClose={onClose} />
        <SidebarNav items={navItems} onLinkClick={handleLinkClick} />
        <SidebarUserProfile
          firstName={userFirstName}
          lastName={userLastName}
          roleLabel={roleLabel}
          onLogout={onLogout}
        />
      </div>
    </>
  );
}

