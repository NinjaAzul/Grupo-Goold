'use client';

import { AppointmentsView } from '@/@components/views/user/appointments';
import { withUserAuth } from '@/hocs/withUserAuth';
import { withPermission } from '@/hocs/withPermission';
import { PERMISSIONS } from '@/constants';

function AppointmentsPageContent() {
  return <AppointmentsView />;
}

export default withUserAuth(
  withPermission(AppointmentsPageContent, {
    permission: PERMISSIONS.APPOINTMENTS,
  })
);

