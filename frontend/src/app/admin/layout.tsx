'use client';

import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/@components/layout/admin/AdminLayout';
import { withAdminAuth } from '@/hocs/withAdminAuth';

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}

export default withAdminAuth(AdminLayoutWrapper);

