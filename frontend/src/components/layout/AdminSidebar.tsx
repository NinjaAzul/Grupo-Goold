'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogoIcon, XIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Agendamentos',
    href: '/admin/agendamentos',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    href: '/admin/clientes',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Logs',
    href: '/admin/logs',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {onClose && (
        <div
          className={cn(
            'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-background min-h-screen flex flex-col border-r border-sidebar transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64'
        )}
        style={{ borderRightColor: '#D7D7D7' }}
      >
      {/* Logo */}
      <div className="bg-background-white" style={{ borderBottom: '1px solid #D7D7D7' }}>
        <div className="p-6 flex items-center justify-between h-[96px]">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
            <LogoIcon className="w-8 h-8 text-white" />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-primary transition-colors"
              aria-label="Fechar menu"
            >
              <XIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4" style={{ borderTop: '1px solid #D7D7D7' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-primary">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-primary transition-colors"
            aria-label="Sair"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

