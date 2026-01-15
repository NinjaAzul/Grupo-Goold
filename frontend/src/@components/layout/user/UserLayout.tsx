'use client';

import { useState } from 'react';
import { UserSidebar } from './UserSidebar';
import { HeaderDesktop, HeaderMobile, PageHeader } from '../common';
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
        <HeaderDesktop title={title} description={description} />
        
        <HeaderMobile onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
          {title && (
            <div className="lg:hidden mb-6">
              <PageHeader title={title} description={description} />
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

