'use client';

import { LogoutIcon } from '@/@components/icons';

interface SidebarUserProfileProps {
  firstName?: string;
  lastName?: string;
  roleLabel: string;
  onLogout: () => void;
}

export function SidebarUserProfile({ firstName, lastName, roleLabel, onLogout }: SidebarUserProfileProps) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-primary">
            {firstName} {lastName}
          </p>
          <p className="text-sm text-gray-500">{roleLabel}</p>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-primary hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="Sair"
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

