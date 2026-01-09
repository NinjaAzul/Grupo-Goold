'use client';

import { LoginView } from '@/components/views/admin/auth/login';

export default function AdminPage() {
  return <LoginView title="Login Admin" defaultRedirect="/admin/agendamentos" />;
}
