'use client';

import { SidebarLogo } from './SidebarLogo';
import { SidebarNav, type NavItem } from './SidebarNav';
import { SidebarUserProfile } from './SidebarUserProfile';

interface SidebarDesktopProps {
  navItems: NavItem[];
  userFirstName?: string;
  userLastName?: string;
  roleLabel: string;
  onLogout: () => void;
}

export function SidebarDesktop({
  navItems,
  userFirstName,
  userLastName,
  roleLabel,
  onLogout,
}: SidebarDesktopProps) {
  return (
    <div className="hidden lg:flex lg:static inset-y-0 left-0 z-50 bg-background min-h-screen flex-col border-r border-sidebar w-64">
      <SidebarLogo />
      <SidebarNav items={navItems} />
      <SidebarUserProfile
        firstName={userFirstName}
        lastName={userLastName}
        roleLabel={roleLabel}
        onLogout={onLogout}
      />
    </div>
  );
}

