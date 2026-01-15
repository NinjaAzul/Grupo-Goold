'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, LogsIcon, UserIcon } from '@/@components/icons';
import { SidebarMobile, SidebarDesktop, type NavItem } from '../common';

interface IUserPermission {
  permission: IPermission;
  granted: boolean;
}

interface IPermission {
  id: number;
  name: string;
}

const navItems: NavItem[] = [
  {
    label: 'Agendamentos',
    href: '/user/appointments',
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  {
    label: 'Logs',
    href: '/user/logs',
    icon: <LogsIcon className="w-5 h-5" />,
    requiresPermission: 'LOGS',
  },
  {
    label: 'Minha Conta',
    href: '/user/my-account',
    icon: <UserIcon className="w-5 h-5" />,
  },
];

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function UserSidebar({ isOpen = true, onClose }: UserSidebarProps) {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiresPermission) return true;
    if (!user || !('permissions' in user) || !user.permissions) return false;
    const permission = (user.permissions as IUserPermission []).find(
      (p: IUserPermission) => p.permission?.name === item.requiresPermission
    );
    return permission?.granted === true;
  });

  return (
    <>
      {onClose && (
        <SidebarMobile
          isOpen={isOpen}
          onClose={onClose}
          navItems={filteredNavItems}
          userFirstName={user?.firstName}
          userLastName={user?.lastName}
          roleLabel="Cliente"
          onLogout={logout}
        />
      )}
      <SidebarDesktop
        navItems={filteredNavItems}
        userFirstName={user?.firstName}
        userLastName={user?.lastName}
        roleLabel="Cliente"
        onLogout={logout}
      />
    </>
  );
}

