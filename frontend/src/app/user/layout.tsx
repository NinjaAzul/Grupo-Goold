'use client';

import { UserLayout } from '@/components/layout/UserLayout';
import { withUserAuth } from '@/hocs/withUserAuth';

function UserLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}

export default withUserAuth(UserLayoutWrapper);

