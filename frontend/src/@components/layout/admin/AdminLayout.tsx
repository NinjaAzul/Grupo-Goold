'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { PageHeader, HeaderMobile, HeaderDesktop } from '../common';
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
        <HeaderDesktop title={title} description={description} />

        <HeaderMobile onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
       
          <div className="lg:hidden mb-6">
            {title && <PageHeader title={title} description={description} />}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
