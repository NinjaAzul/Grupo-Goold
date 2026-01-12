'use client';

import { LoginView } from '@/components/views/admin/auth/login/LoginView';

export default function UserLoginPage() {
  return (
    <LoginView
      title="Entre na sua conta"
      defaultRedirect="/user/agendamentos"
    />
  );
}

