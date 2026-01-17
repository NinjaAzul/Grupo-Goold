'use client';

import { LogsView } from '@/@components/views/user/logs';
import { withUserAuth } from '@/hocs/withUserAuth';
import { withPermission } from '@/hocs/withPermission';
import { PERMISSIONS } from '@/constants';

function LogsPageContent() {
  return <LogsView />;
}

export default withUserAuth(
  withPermission(LogsPageContent, {
    permission: PERMISSIONS.LOGS,
  })
);

