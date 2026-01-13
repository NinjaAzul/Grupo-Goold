'use client';

import { AuthLayout } from '@/@components/layout/auth/AuthLayout';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayoutWrapper({ children }: AuthLayoutProps) {
  return (
    <AuthLayout buttonText="Cadastre-se" buttonLink="/user/register">
      {children}
    </AuthLayout>
  );
}

