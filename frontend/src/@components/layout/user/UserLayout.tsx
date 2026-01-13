'use client';

import { useState } from 'react';
import { UserSidebar } from './UserSidebar';
import { PageHeader } from '../admin/PageHeader';
import { MenuIcon, LogoIcon } from '@/@components/icons';
import { usePage } from '@/contexts/PageContext';

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { title, description } = usePage();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0 bg-background-white">
        {/* Desktop Header - alinhado com header da sidebar */}
        <div className="hidden lg:block bg-background-white border-b border-border">
          <div className="p-6 h-[96px] flex items-center">
            {title && (
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{title}</h1>
                {description && (
                  <p className="text-sm lg:text-base text-gray-600">{description}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-background-white p-4 flex items-center gap-4 border-b border-border">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 hover:text-primary transition-colors"
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </button>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
          {/* Mobile: mostrar header aqui */}
          <div className="lg:hidden mb-6">
            {title && <PageHeader title={title} description={description} />}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

