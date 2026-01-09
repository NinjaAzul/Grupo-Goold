'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { PageHeader } from './PageHeader';
import { MenuIcon, LogoIcon } from '@/components/icons';
import { usePage } from '@/contexts/PageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { title, description } = usePage();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0 bg-background-white">
        {/* Desktop Header - alinhado com header da sidebar */}
        <div className="hidden lg:block bg-background-white" style={{ borderBottom: '1px solid #D7D7D7' }}>
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
        <div className="lg:hidden bg-background-white p-4 flex items-center gap-4" style={{ borderBottom: '1px solid #D7D7D7' }}>
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
