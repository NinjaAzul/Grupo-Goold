'use client';

import { usePathname } from 'next/navigation';
import { AuthLayout } from '@/@components/layout/auth/AuthLayout';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const PATHS: Record<string, { buttonText: string; buttonLink: string }> = {
  ['/auth/login']: {
    buttonText: 'Cadastre-se',
    buttonLink: '/auth/register',
  },
  ['/auth/register']: {
    buttonText: 'Login',
    buttonLink: '/auth/login',
  },
} as const;

export default function AuthLayoutWrapper({ children }: AuthLayoutProps) {
  const pathname = usePathname();

 
  const getButtonTextAndLink = () => {
    return {
      buttonText: PATHS[pathname]?.buttonText,
      buttonLink: PATHS[pathname]?.buttonLink,
    };
  };

  return (
    <AuthLayout buttonText={getButtonTextAndLink().buttonText} buttonLink={getButtonTextAndLink().buttonLink}>
      {children}
    </AuthLayout>
  );
}

