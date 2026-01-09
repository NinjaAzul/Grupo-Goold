'use client';

import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { withAdminAuth } from '@/hocs/withAdminAuth';

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

export default withAdminAuth(AdminLayoutWrapper);

