'use client';

import { LoginView } from '@/@components/views/admin/auth/login';

export default function AdminLoginPage() {
  return (
    <LoginView
      title="Login Admin"
      defaultRedirect="/admin/appointments"
    />
  );
}

