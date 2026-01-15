'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, UsersIcon, LogsIcon } from '@/@components/icons';
import { SidebarMobile, SidebarDesktop } from '../common';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Agendamentos',
    href: '/admin/appointments',
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  {
    label: 'Clientes',
    href: '/admin/clients',
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    label: 'Logs',
    href: '/admin/logs',
    icon: <LogsIcon className="w-5 h-5" />,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {onClose && (
        <SidebarMobile
          isOpen={isOpen}
          onClose={onClose}
          navItems={navItems}
          userFirstName={user?.firstName}
          userLastName={user?.lastName}
          roleLabel="Admin"
          onLogout={logout}
        />
      )}
      <SidebarDesktop
        navItems={navItems}
        userFirstName={user?.firstName}
        userLastName={user?.lastName}
        roleLabel="Admin"
        onLogout={logout}
      />
    </>
  );
}

